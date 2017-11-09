'use strict'
/**
 * This module is an extensively documented walkthrough for typechecking a
 * basic functional language using the Hindley-Damas-Milner algorithm.
 *
 * This is a port of the same algorithm from Haskell to JS. It can be found
 * under https://github.com/quchen/articles/blob/master/hindley-milner.
 *
 * In the end, we'll be able to infer the type of expressions like
 *
 * @
 * find (λx. (>) x 0)
 *   :: [Integer] → Either () Integer
 * @
 *
 * It can be used in multiple different forms:
 *
 * * The source is written in literal programming style, so you can almost
 *   read it from to bottom, minus some few references to later topics.
 * * /Loads/ of doctests (runnable and verified code examples) are included
 * * The code is runnable in NodeJS, all definitions are exposed.
 * * A small main module that gives many examples of what you might try out in
 *   Node interactive mode is also included.
 */



// #############################################################################
// #############################################################################
// * Preliminaries
// #############################################################################
// #############################################################################



// #############################################################################
// ** Names
// #############################################################################



/**
 * A 'name' is an identifier in the language we're going to typecheck.
 * Variables on both the term and type leve have 'Name's, for example.
 */
const Name = String


/**
 * Pretty visualization for 'Name'. It'll be further implemented to other
 * structures
 */
Name.prototype.ppr = function () {
    return this.toString()
}



// #############################################################################
// ** Monotypes
// #############################################################################



/**
 * A monotype is an unquantified/unparametric type, in other words it contains
 * no @forall@s. Monotypes are the inner building blocks of all types. Examples
 * of monotypes are @Int@, @a@, @a → b@.
 *
 * In formal notation, 'MType's are often called τ (tau) types.
 */
// TVar :: MType
const TVar = function (name) { // ^ @a@
    this.name = name
}


// TFun :: MType
const TFun = function (parameter, returns) { // ^ @a → b@
    this.parameter = parameter
    this.returns = returns
}


// TConst :: MType
const TConst = function (name) { // ^ @Int@, @()@, …
    this.name = name
}


/**
 * Since we can't declare our own types in our simple type system here, we'll
 * hard-code certain basic ones so we can typecheck some familiar functions
 * that use them later.
 */
// TList :: MType
const TList = function (type) { // ^ @[a]@
    this.type = type
}


// TEither :: MType
const TEither = function (left, right) { // ^ @Either a b@
    this.left = left
    this.right = right
}


// TTuple :: MType
const TTuple = function (first, second) { // ^ @(a, b)@
    this.first = first
    this.second = second
}


/**
 * >>> console.log(new TFun(new TEither(new TVar('a'), new TVar('b')), new TFun(new TVar('c'), new TVar('d'))).ppr())
 * Either a b → c → d
 */
TVar.prototype.ppr = function () {
    return this.name
}


TList.prototype.ppr = function () {
    return `[${this.type.ppr()}]`
}


TEither.prototype.ppr = function () {
    return `Either ${this.left.ppr()} ${this.right.ppr()}`
}


TTuple.prototype.ppr = function () {
    return `Tuple ${this.first.ppr()} ${this.second.ppr()}`
}


TConst.prototype.ppr = function () {
    return this.name.ppr()
}


TFun.prototype.ppr = function (parenthesize = false) {
    const lhs = this.parameter.ppr(true)
    const rhs = this.returns.ppr()

    return parenthesize
        ? `(${lhs} → ${rhs})`
        :  `${lhs} → ${rhs}`
}



/**
 * The individual variables of an 'MType'. This is simply the collection of all the
 * individual type variables ocurring inside of it.
 *
 * __Example:__ The free variables of @a → b@ are @a@ and @b@.
 */
// freeMType :: MType → Set Name
TVar.prototype.freeMType = function () {
    return new Set([this.name])
}


TFun.prototype.freeMType = function () {
    return new Set([...this.parameter.freeMType(), ...this.returns.freeMType()])
}


TList.prototype.freeMType = function () {
    return this.type.freeMType()
}


TEither.prototype.freeMType = function () {
    return new Set([...this.left.freeMType(), ...this.right.freeMType()])
}


TTuple.prototype.freeMType = function () {
    return new Set([...this.first.freeMType(), ...this.second.freeMType()])
}


TConst.prototype.freeMType = function () {
    return new Set()
}

