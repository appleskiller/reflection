// -----------------------------------------------------------
// Interfaces
// ===========================================================
/**
 * 类类型
 * 
 * @export
 * @interface IClass
 * @extends {Function}
 */
export interface IClass extends Function{
	new (...args): IClass;
}
/**
 * 属性描述
 * 
 * @export
 * @interface IPropertySchema
 */
export interface IPropertySchema {
	[key: string]: any;
	/**
	 * 属性名
	 * 
	 * @type {string}
	 */
	name: string;
	/**
	 * 标记是否是静态成员
	 * 
	 * @type {boolean}
	 */
	isStatic: boolean;
	/**
	 * 标记是否是方法成员
	 * 
	 * @type {boolean}
	 */
	isMethod: boolean;
	/**
	 * 成员的类型名。如果存在则是一个类的完整类名
	 */
	type?: string;
}
/**
 * 类描述
 * 
 * @export
 * @interface IClassSchema
 */
export interface IClassSchema {
	[key: string]: any;
	/**
	 * 类名称
	 * 
	 * @type {string}
	 */
	className: string,
	/**
	 * 父类名称
	 * 
	 * @type {string}
	 */
	superClass: string;
	/**
	 * 静态属性
	 * 
	 * @type {{[key: string]: IPropertySchema}}
	 */
	staticProperties: {[key: string]: IPropertySchema};
	/**
	 * 属性
	 * 
	 * @type {{[key: string]: IPropertySchema}}
	 */
	properties: {[key: string]: IPropertySchema};
}

export interface IObjectSchema {
	/**
	 * 对象的类型
	 * 
	 * @type {string}
	 */
	type: string,
	/**
	 * 属性
	 * 
	 * @type {{[key: string]: IPropertySchema}}
	 */
	properties: {[key: string]: IPropertySchema};
}

/**
 * 钩子类型。registerMetadataHook方法type参数的有效枚举
 * 
 * @export
 * @interface IHookTypes
 */
export interface IHookTypes {
	CLASS: string;
	STATIC_PROPERTY: string;
	PROPERTY: string;
}
/**
 * 为类和类成员添加额外的元信息。使用@metadata(key, value)注册自定义元信息或使用内建字段赋值，例如@metadata.className("ClassA")即为class命名为ClassA.
 * 
 * @export
 * @interface IMetadataStatic
 */
export interface IMetadataStatic {
	(key: string, value?: any): Function;
	/**
	 * 为类附加类名信息。
	 * 
	 * @param {string} value 
	 * @returns {Function} 
	 */
	className(value: string): Function;
	/**
	 * 为类附加父类名信息
	 * 
	 * @param {(string | Function | IClass)} value 
	 * @returns {Function} 
	 */
	superClass(value: string | Function | IClass): Function;
	/**
	 * 为属性附加类型信息
	 * 
	 * @param {(string | Function | IClass)} value 
	 * @returns {Function} 
	 */
	type(value: string | Function | IClass): Function;
}
/**
 * 反射工具方法集.
 */
/**
 * 
 */
export interface IReflectorUtil {
	/**
	 * 获得指定对象的类。obj参数为除null和undefined外的任意对象。
	 * 
	 * @param {*} obj 除null和undefined外的任意对象
	 * @returns {IClass} 类对象
	 */
	getClass(obj: any): IClass;
	/**
	 * 获得指定类的类名。
	 * 
	 * @param {(Function | IClass)} classObject 类对象
	 * @returns {string} 类名
	 */
	getClassName(classObject: Function | IClass): string;
	/**
	 * 获得指定类名的类。
	 * 
	 * @param {string} className 类名
	 * @returns {IClass} 类对象
	 */
	getClassByName(className: string): IClass;
	/**
	 * 获得指定类的父类
	 * 
	 * @param {(Function | IClass)} classObject 类对象
	 * @returns {IClass} 父类对象
	 */
	getSuperClass(classObject: Function | IClass): IClass;
	/**
	 * 获得指定类的父类名
	 * 
	 * @param {(Function | IClass)} classObject 类对象
	 * @returns {string} 父类类名
	 */
	getSuperClassName(classObject: Function | IClass): string;
	/**
	 * 使用指定类名和参数构造类实例
	 * 
	 * @param {string} className 类名
	 * @param {any} args 构造函数参数
	 * @returns {*} 类实例对象
	 */
	newInstance(className: string, ...args): any;
	/**
	 * 获得类的描述。如果declared为false(默认)此方法只返回声明在其自身上的描述信息，不包含父类中声明的信息，否则将返回在此类及所有祖辈类上声明的信息
	 * 
	 * @param {(Function | IClass)} classObject 类对象
	 * @param {boolean} [declared] 是否反射祖辈描述
	 * @returns {IClassSchema} 类描述
	 */
	getClassSchema(classObject: Function | IClass, declared?: boolean): IClassSchema;
	/**
	 * 获得任意对象的描述。如果指定对象为函数，则按类对象进行反射并返回描述.
	 * 如果allMembers设置为true，将尝试反射所有属性成员的描述，否则，则返回其类型所声明的成员描述
	 * 
	 * @param {*} obj 指定对象
	 * @param {boolean} [allMembers] 是否反射全部成员描述
	 * @returns {IObjectSchema} 
	 */
	describe(obj: any, allMembers?: boolean): IObjectSchema;
	/**
	 * 获得对象制定属性的描述。如果obj为函数，则返回的描述中isStatic属性为true。
	 * 如果obj为null或undefined则将抛出异常。
	 * 
	 * @param {*} obj 
	 * @param {string} propertyName 对象属性名称
	 * @param {*} value 对象属性值
	 * @returns {IPropertySchema} 属性描述
	 */
	describeProperty(obj: any, propertyName: string, value: any): IPropertySchema;
}

var name2Class: {[className: string]: Function | IClass} = {};

// -----------------------------------------------------------
// Utils
// ===========================================================
function isDefined(value: any): boolean {
	return value !== null && value !== undefined;
}
function isClass(obj: any): boolean {
	return typeof obj === "function";
}
function isObject(x: any): boolean {
	return typeof x === "object" && x !== null;
}
function mixin(target: any, source: any): void {
	for (var key in source) { target[key] = source[key]; }
}
var count = 0;
function uniqueId(prefex: string): string {
	return prefex + "_" + (count++);
}
// -----------------------------------------------------------
// Hooks
// ===========================================================
/**
 * 钩子类型。registerMetadataHook方法type参数的有效枚举
 * @type {IHookTypes}
 */
export var hookTypes: IHookTypes = {
	CLASS: "classHook",
	STATIC_PROPERTY: "staticPropertyHook",
	PROPERTY: "propertyHook",
}
var hooks = {
	classHook: {},
	staticPropertyHook: {},
	propertyHook: {}
}
/**
 * 注册元信息描述钩子函数。在为类附加描述信息时，处理器会顺序调用已注册的钩子函数，将最终的返回结果注册为元信息值。
 * 
 * @export
 * @param {string} type 钩子类型。reflector.hookTypes声明了可选类型
 * @param {string} key 元信息键名
 * @param {((value: any, classObject: Function | IClass, oriValue: any) => any)} hook 钩子函数。value为上一个钩子函数的返回值，oriValue为未处理的初始值
 */
export function registerMetadataHook(type: string, key: string, hook: (value: any, classObject: Function | IClass, oriValue: any) => any): void {
	if (!hooks[type] || !key || !hook) throw new TypeError();
	var array = hooks[type][key] = hooks[type][key] || [];
	array.push(hook);
}

// -----------------------------------------------------------
// metadata
// ===========================================================
// 排除不必merge到属性描述上的class描述
var ignorePropertySchemaMergeKeys = {
	className: true,
	superClass: true,
	properties: true,
	staticProperties: true,
}
// 排除不必merge到对象描述上的class描述
var ignoreObjectSchemaMergeKeys = {
	className: true,
	superClass: true,
	properties: true,
	staticProperties: true,
}
function mergePropertySchema(schema: IPropertySchema, superSchema: IPropertySchema): IPropertySchema {
	var result = <IPropertySchema>{};
	var key;
	if (schema) {
		// merge schema
		for (key in schema) { result[key] = schema[key]; }
	}
	if (superSchema) {
		// merge superschema
		for (key in superSchema) {
			if (key in result) { continue; }
			else { result[key] = superSchema[key] }
		}
	}
	return result;
}
function mergeClassSchemaProperties(properties: { [key: string]: IPropertySchema }, superProperties: { [key: string]: IPropertySchema }): { [key: string]: IPropertySchema } {
	var result = <{ [key: string]: IPropertySchema }>{};
	var propertyName;
	for (propertyName in properties) { result[propertyName] = properties[propertyName]; }
	if (superProperties) {
		for (propertyName in superProperties) {
			result[propertyName] = mergePropertySchema(result[propertyName], superProperties[propertyName]);
		}
	}
	return result;
}
function mergeSchema(schema: IClassSchema, superSchema: IClassSchema): IClassSchema {
	var result = <IClassSchema>{};
	var key;
	for (key in schema) { result[key] = schema[key]; }
	for (key in superSchema) {
		// merge properties
		if (key === "properties") { result[key] = mergeClassSchemaProperties(result[key], superSchema[key]) }
		// merge staticProperties 不merge父类静态属性
		else if (key === "staticProperties") { result[key] = mergeClassSchemaProperties(result[key], null) }
		else if (key in result) { continue }
		else { result[key] = superSchema[key] }
	}
	return result;
}
function createNullValueSchema(propName: string, propertySchema: IPropertySchema, isStatic: boolean): IPropertySchema {
	if (!propertySchema) return {name: propName, type: "null", isMethod: false, isStatic: isStatic};
	var result = <IPropertySchema>{};
	// merge schema
	for (var key in propertySchema) { result[key] = propertySchema[key]; }
	result.type = propertySchema.type || "null";
	result.isStatic = isStatic;
	return result;
}
function createUndefinedValueSchema(propName: string, propertySchema: IPropertySchema, isStatic: boolean): IPropertySchema {
	if (!propertySchema) return {name: propName, type: "undefined", isMethod: false, isStatic: isStatic};
	var result = <IPropertySchema>{};
	// merge schema
	for (var key in propertySchema) { result[key] = propertySchema[key]; }
	result.type = propertySchema.type || "undefined";
	result.isStatic = isStatic;
	return result;
}
function createFunctionValueSchema(propName: string, propertySchema: IPropertySchema, isStatic: boolean): IPropertySchema {
	if (!propertySchema) return {name: propName, type: "function", isMethod: false, isStatic: isStatic};
	var result = <IPropertySchema>{};
	// merge schema
	for (var key in propertySchema) { result[key] = propertySchema[key]; }
	result.type = propertySchema.type || "function";
	result.isStatic = isStatic;
	return result;
}
/**
 * 创建对象属性描述。
 * 
 * @param {*} value 
 * @param {IPropertySchema} propertySchema 
 * @returns {IPropertySchema} 
 */
function createObjectPropertySchema(propName: string, value: any, propertySchema: IPropertySchema, isStatic: boolean): IPropertySchema {
	if (value === null) return createNullValueSchema(propName, propertySchema, isStatic);
	else if (value === undefined) return createUndefinedValueSchema(propName, propertySchema, isStatic);
	else if (typeof value === "function") return createFunctionValueSchema(propName, propertySchema, isStatic);

	var result = <IPropertySchema>{};
	var key;
	// merge schema
	if (propertySchema) {
		for (key in propertySchema) { result[key] = propertySchema[key]; }
	}
	// merge metadata by classObject
	var classObject: IClass = value.constructor;
	var classSchema = getOrCreateDeclaredClassSchema(classObject);
	for (key in classSchema) {
		if (key in result || ignorePropertySchemaMergeKeys[key]) { continue; }
		else { result[key] = classSchema[key] }
	}
	result.type = classSchema.className;
	result.isStatic = isStatic;
	return result;
}
function createObjectSchema(schema: IClassSchema): IObjectSchema {
	var result = <IObjectSchema>{
		type: schema.className,
		properties: {}
	};
	for (var key in schema) {
		if (ignoreObjectSchemaMergeKeys[key] || key in result) { continue; }
		result[key] = schema[key];
	}
	return result;
}
function getOrCreateClassSchema(classObject: Function | IClass): IClassSchema {
	if (!classObject["__classSchema__"]) classObject["__classSchema__"] = {
		className: uniqueId('unnamed_class'),
		superClass: "Object",
		staticProperties: {},
		properties: {}
	};
	return classObject["__classSchema__"];
}
function getOrCreateDeclaredClassSchema(classObject: Function | IClass): IClassSchema {
	if (!classObject["__declaredClassSchema__"]) {
		var schema = getOrCreateClassSchema(classObject);
		var superSchema = null;
		var superClass = name2Class[schema.superClass];
		if (superClass) {
			superSchema = getOrCreateDeclaredClassSchema(superClass);
		}
		classObject["__declaredClassSchema__"] = mergeSchema(schema, superSchema);
	};
	return classObject["__declaredClassSchema__"];
}
function getOrCreatePropertySchema(classObject: Function | IClass, propName: string, isMethod: boolean, isStatic: boolean): IPropertySchema {
	var schema = getOrCreateClassSchema(classObject);
	var properties = isStatic ? schema.staticProperties : schema.properties;
	if (!properties[propName]) properties[propName] = {
		name: propName,
		isStatic: isStatic,
		isMethod: isMethod,
	}
	return properties[propName];
}

function getMetadataValue(hookArray: (value: any, classObject: Function | IClass, oriValue: any) => any[] , value: any, classObject: Function | IClass): any {
	if (!hookArray || !hookArray.length) return value;
	var oriValue = value;
	for (var i: number = 0; i < hookArray.length; i++) {
		hookArray[i] && (value = hookArray[i](value , classObject , oriValue));
	}
	return value;
}
function classDecorator(key: string, classObject: Function | IClass, value?: any): void {
	var schema = getOrCreateClassSchema(classObject);
	schema[key] = getMetadataValue(hooks.classHook[key], value, classObject);
}
function staticPropertyDecorator(key: string, classObject: Function | IClass, memberName: string, isMethod: boolean, value?: any): void {
	var schema = getOrCreatePropertySchema(classObject , memberName , isMethod, true);
	schema[key] = getMetadataValue(hooks.staticPropertyHook[key], value, classObject);
}
function propertyDecorator(key: string, classProto: Object, memberName: string, isMethod: boolean, value?: any): void {
	var classObject = classProto.constructor;
	var schema = getOrCreatePropertySchema(classProto.constructor , memberName , isMethod, false);
	schema[key] = getMetadataValue(hooks.propertyHook[key], value, classObject);
}
export var metadata: IMetadataStatic = <IMetadataStatic>function (key: string, value?: any): Function {
	function internalDecorator(target: Object, targetKey?: string, desc?: any): void {
		if (isClass(target)) {
			if (!targetKey) {
				classDecorator(key, <Function>target, value);
			} else {
				// 如果desc === undefined则认为是一个静态成员属性，否则为成员方法
				staticPropertyDecorator(key, <Function>target, targetKey, (desc !== undefined), value);
			}
		} else if (isDefined(targetKey) && isObject(target)){
			// 如果desc === undefined则认为是一个成员属性，否则为成员方法
			propertyDecorator(key, target, targetKey, (desc !== undefined), value);
		} else {
			throw new TypeError();
		}
	}
	return internalDecorator;
}
mixin(metadata , {
	// -----------------------------------------------------------
	// Common Class Schema metadata
	// ===========================================================
	className: function (value: string): Function {
		if (!value) throw ReferenceError();
		return metadata("className" , value); 
	},
	superClass: function (value: string | Function | IClass): Function {
		if (!value) throw ReferenceError();
		var className = isClass(value) ? util.getClassName(<IClass>value) : value;
		return metadata("superClass" , className);
	},
	// -----------------------------------------------------------
	// Common Property Schema metadata
	// ===========================================================
	type: function (value: string | Function | IClass): Function {
		if (!value) throw ReferenceError();
		var className = isClass(value) ? util.getClassName(<IClass>value) : value; 
		return metadata("type" , className); 
	}
})
// -----------------------------------------------------------
// Internal Schema
// ===========================================================
function registerPrimitiveType(className, classObject) {
	name2Class[className] = classObject;
	getOrCreateClassSchema(classObject).className = className;
}
registerPrimitiveType("Object", Object);
registerPrimitiveType("Array", Array);
registerPrimitiveType("Function", Function);
registerPrimitiveType("Date", Date);
registerPrimitiveType("Number", Number);
registerPrimitiveType("String", String);
registerPrimitiveType("Boolean", Boolean);

// -----------------------------------------------------------
// Util
// ===========================================================
// register className hook
registerMetadataHook(hookTypes.CLASS, "className", (value: any, classObject: Function, oriValue: any) => {
	name2Class[value] = classObject;
	return value;
})
export var util: IReflectorUtil = {
	getClass: function (obj: any): IClass {
		if (isClass(obj)) return obj;
		if (isDefined(obj)) return obj.constructor;
		throw new ReferenceError();
	},
	getClassName: function (classObject: Function | IClass): string {
		return util.getClassSchema(classObject).className;
	},
	getClassByName: function (className: string): IClass {
		return <IClass>name2Class[className];
	},
	getSuperClass: function (classObject: Function | IClass): IClass {
		var superClass = util.getClassSchema(classObject).superClass;
		return util.getClassByName(superClass);
	},
	getSuperClassName: function (classObject: Function | IClass): string {
		return util.getClassSchema(classObject).superClass;
	},
	newInstance: function (className: string, ...args): any {
		var classObject = util.getClassByName(className);
		if (isClass(classObject)) {
			switch (args.length) {
				case 0: return new classObject();
				case 1: return new classObject(args[0]);
				case 2: return new classObject(args[0], args[1]);
				case 3: return new classObject(args[0], args[1], args[2]);
				case 4: return new classObject(args[0], args[1], args[2], args[3]);
				case 5: return new classObject(args[0], args[1], args[2], args[3], args[4]);
				case 6: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5]);
				case 7: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
				case 8: return new classObject(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
			}
			throw new Error("Constructor parameter no more than 8.");
		} else {
			throw new Error(`No Class was found by '${className}'`);
		}
	},
	getClassSchema: function (classObject: Function | IClass, declared?: boolean): IClassSchema {
		return declared ? getOrCreateDeclaredClassSchema(classObject) : getOrCreateClassSchema(classObject);
	},
	describe: function(obj: any, allMembers?: boolean): IObjectSchema {
		if (obj === null) return {type: "null", properties: {}};
		if (obj === undefined) return {type: "undefined", properties: {}};
		var isClassObject = isClass(obj);
		var classObject: IClass = isClassObject ? obj : obj.constructor;
		var classSchema = util.getClassSchema(classObject, true);
		var result: IObjectSchema = createObjectSchema(classSchema);
		var propertiesSchema = isClassObject ? classSchema.staticProperties : classSchema.properties;
		// properties
		var value;
		for (var key in obj) {
			value = obj[key];
			if (allMembers || propertiesSchema[key]) {
				result.properties[key] = createObjectPropertySchema(key, value, propertiesSchema[key], isClassObject);
			}
		}
		return result;
	},
	describeProperty: function (obj: any, propertyName: string, value: any): IPropertySchema {
		if (!isDefined(obj)) throw new ReferenceError();
		var isClassObject = isClass(obj);
		var value = arguments.length === 3 ? value : obj[propertyName];
		var classObject: IClass = isClassObject ? obj : obj.constructor;
		var classSchema = util.getClassSchema(classObject, true);
		var propertiesSchema = isClassObject ? classSchema.staticProperties : classSchema.properties;
		return createObjectPropertySchema(propertyName, value, propertiesSchema[propertyName], isClassObject);
	}
}