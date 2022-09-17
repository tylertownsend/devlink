import express from 'express';

const router = express.Router();
import { auth } from '../../middleware/auth';
import {check, validationResult} from 'express-validator';

import { ProfileModel } from '../../models/profile';
import { User, UserModel } from '../../models/users';

/**
 * @route       GET api/profile/me
 * @description Get current users profile.
 * @access      Private
 */
router.get('/me', auth, async (req: any, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id }).populate(['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route       POST api/profile
 * @description Create or update user profile
 * @access      Private
 */
router.post(
  '/',
  [
    auth,
    // [
    //   check('status', 'Status is required')
    //     .not()
    //     .isEmpty(),
    //   check('skills', 'Skills is required')
    //     .not()
    //     .isEmpty()
    // ]
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const {
    //   company,
    //   website,
    //   location,
    //   bio,
    //   status,
    //   githubUsername,
    //   skills,
    //   youtube,
    //   facebook,
    //   twitter,
    //   instagram,
    //   linkedin
    // } = req.body;

    // const profileFields = {
    //   user: req.user.id,
    //   website,
    //   location,
    //   bio,
    //   status,
    //   githubUsername,
    //   skills,
    //   social: {
    //     youtube,
    //     facebook,
    //     twitter,
    //     instagram,
    //     linkedin
    //   }
    // }

     const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields: any = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio; 
    if (status) profileFields.status = status;
    if (githubUsername) profileFields.githubusername = githubUsername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill: any) => skill.trim());
    }

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;


    try {
      let profile = await ProfileModel.findOne({ user: req.user.id });

      if(profile) {
        profile = await ProfileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        res.json(profile);
      } else {
        profile = new ProfileModel(profileFields);

        await profile.save();
        res.json(profile);
      }
    } catch(err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route       Get api/profile
 * @description Get all profiles
 * @access      Public
 */
router.get('/', async (req, res) => {
  try { 
    const profiles = await ProfileModel.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       Get api/profile/user/:user_id
 * @description Get profile by users id
 * @access      Public
 */
router.get('/user/:user_id', async (req, res) => {
  try { 
    const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch(err: any) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
       return res.status(400).json({ msg: 'Profile not found' });
   }
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/profile/user/:user_id
 * @description DELETE profile, users, and posts
 * @access      Private
 */
router.delete('/', auth, async (req: any, res) => {
  try { 
    await ProfileModel.findOneAndRemove({ user: req.user.id });
    await UserModel.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted' });
  } catch(err: any) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
       return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route       PUT api/profile/experience
 * @description Add profile experience
 * @access      Private
 */
router.put('/experience', 
  [
    auth, 
    // [
    //   check('title', 'Title is required').not().isEmpty(),
    //   check('company', 'Company is required').not().isEmpty(),
    //   check('from', 'From Date is required').not().isEmpty()
    // ]
  ], 
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
  try { 
    const profile = await ProfileModel.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/profile/experience/:exp_id
 * @description Delete experience from profile
 * @access      Private
 */
router.delete('/experience/:exp_id', auth, async (req: any , res) => {
  try { 
    const profile = await ProfileModel.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    const removeIndex = profile.experience.map((item: any) => item.id).indexOf(req.params.exp_id);


    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch(err: any) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
       return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

/**
 * @route       PUT api/profile/education
 * @description Add profile education
 * @access      Private
 */
router.put('/education', [
  auth, 
  // [
  //   check('school', 'School is required').not().isEmpty(),
  //   check('degree', 'Degree is required').not().isEmpty(),
  //   check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
  //   check('from', 'From Date is required').not().isEmpty()
  // ]
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldOfStudy,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      location,
      fieldOfStudy,
      from,
      to,
      current,
      description
    }
  try { 
    const profile = await ProfileModel.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    profile.education.unshift(newEdu);

    await profile.save();
    res.json(profile);
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route       DELETE api/profile/education/:edu_id
 * @description Delete education from profile
 * @access      Private
 */
router.delete('/education/:exp_id', auth, async (req: any, res) => {
  try { 
    const profile = await ProfileModel.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    const removeIndex = profile.education.map((item: any) => item.id).indexOf(req.params.exp_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch(err: any) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
       return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});
module.exports = router;