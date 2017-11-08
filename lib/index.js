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
