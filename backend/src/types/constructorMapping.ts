export type ConstructorMapping<T> =
    T extends NumberConstructor ? number :
    T extends StringConstructor ? string : never; // etc: continue as needed