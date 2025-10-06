var R          = require('ramda');
var fromObject = require('./from-object');

module.exports = R.curry(function stringify (opts, tree) {
    var displayName = opts.displayName;
    var defaultProps = tree.props || {};
    var defaultPropsEntries = Object.keys(defaultProps);
    
    // Create destructuring assignment for default props
    var destructuringPattern = defaultPropsEntries.length > 0 
        ? '{' + defaultPropsEntries.map(function(key) {
            return key + ' = ' + JSON.stringify(defaultProps[key]);
          }).join(', ') + ', ...restProps}'
        : 'props';
    
    // Merge defaults with rest props for the final props object
    var propsExpression = defaultPropsEntries.length > 0
        ? 'Object.assign({' + defaultPropsEntries.map(function(key) {
            return key + ': ' + key;
          }).join(', ') + '}, restProps)'
        : 'props';

    var preamble = [
        'var React = require(\'react\');',
        '',
        'function ' + displayName + ' (' + destructuringPattern + ') {',
    ];

    var postamble = [
        '}',
        '',
        'module.exports = ' + displayName + ';',
        '',
        displayName + '.default = ' + displayName + ';',
        ''
    ];

    return preamble.
        concat([fromObject(tree, true, propsExpression)]).
        concat(postamble).
        join('\n');
});
