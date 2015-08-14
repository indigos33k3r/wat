
"use strict";

/**
 * Module dependencies.
 */

const _ = require('lodash');

const util = {

  /**
  * Handles tabbed auto-completion based on
  * the doc index. Works perfectly. Looks ugly
  * as hell. Hey: It works.
  *
  * @param {String} text
  * @param {Integer} iteration
  * @param {Object} index
  * @return {String or Array}
  * @api public
  */

  autocomplete: function(text, iteration, index, matchFn) {
    let commands = util.command.prepare(text);
    let lastWord = String(commands[commands.length-1]).trim();
    let otherWords = commands.slice(0, commands.length-1);

    let levels = 0;
    const possibilities = util.traverseIndex(_.clone(commands), index, function(arr, idx){
      levels++;
    });

    const match = matchFn(String(lastWord).trim(), possibilities);
    const exactMatch = (possibilities.indexOf(lastWord) > -1);

    //console.log(possibilities, match, exactMatch);

    if (match && levels !== otherWords.length + 1) {
      let space = (possibilities.indexOf(String(match).trim()) > -1) ? ' ' : '';
      let result = String(otherWords.join(' ') + ' ' + match).trim() + space;
      return result;
    } else {
      let space = (levels === otherWords.length + 1) ? ' ' : '';
      let original = commands.join(' ') + space;
      if (iteration > 1 && possibilities.length > 1) {
        return possibilities;
      } else if (iteration > 1 && possibilities.length === 1 && (otherWords.length !== levels)) {
        let result = original + possibilities[0] + ' ';
        return result;
      } else {
        return original;
      }
    }
  },

  traverseIndex(arr, idx, each) {
    each = each  || function(){}
    let word = arr.shift();
    if (idx[word]) {
      each(arr, idx[word]);
      return util.traverseIndex(arr, idx[word], each);
    } else {
      let items = [];
      for (let item in idx) {
        if (idx.hasOwnProperty(item) && item !== 'index') {
          items.push(item);
        }
      }
      return items;
    }
  },

  command: {

    /**
    * Takes a raw string entered by the user,
    * sanitizes it and returns it as an array
    * of words.
    *
    * @param {String} str
    * @return {Array}
    * @api public
    */

    prepare(str, options, index) {
      //console.log(options)
      options = options || {}
      let all = [];
      let commands = (_.isArray(str)) 
        ? str 
        : String(str).trim().split(' ');
      for (let i = 0; i < commands.length; ++i) {
        var parts = commands[i].split('.');
        for (let j = 0; j < parts.length; ++j) {
          let word = String(parts[j])
            .trim()
            .replace(/\)/g, '')
            .replace(/\(/g, '')
            .replace(/\;/g, '');
          all.push(word);
        }
      }

      var traverse

      //console.log(all)
      //if (options.detail) {
        //all[all.length - 1] = all[all.length - 1] + '.detail';
      //} else if (options.install) {
        //console.log('OMG', all)
        //all[all.length - 1] = all[all.length - 1] + '.install';
        //console.log('OMG', all)
      //}
      return all;
    },

    /**
    * Takes a raw string and converts it into
    * a ready URL root to try loading.
    *
    * @param {String} str
    * @return {String}
    * @api public
    */

    build(str, options, index) {
      let all = util.command.prepare(str, options, index);
      let path = all.join('/');
      return path;
    }

  },

}

module.exports = util;
