(function() {
    'use strict';

    var REG_HREF = /^http(s?):\/\//;

    // inline elements that are considered empty without nested children
    var inlineChildReqElements = {
        abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1,
        dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1,
        strong: 1, sub: 1, sup: 1, tt: 1, u: 1, 'var': 1
    };

    function linkStartEndEvaluator(ckeditorNamespace) {
        var whitespaces = ckeditorNamespace.dom.walker.whitespaces();
        var bookmarkEvaluator = ckeditorNamespace.dom.walker.bookmark(true);
        var isBogus = ckeditorNamespace.dom.walker.bogus();

        return function(node) {
            if (bookmarkEvaluator(node) || whitespaces(node) || isBogus(node)) {
                return false;
            }

            if (node.type == ckeditorNamespace.NODE_ELEMENT && node.is(inlineChildReqElements)) {
                return false;
            }

            // is empty text node
            if (
                node.type == ckeditorNamespace.NODE_TEXT && !ckeditorNamespace.tools.trim(node.getText()).length &&
                !node.hasAscendant('pre')
            ) {
                return false;
            }

            return true;
        };
    }

    function linkStartEndGuard(link) {
        return function(node) {
            return link.contains(node);
        };
    }

    CKEDITOR.plugins.add('openlink', {
        modes: { 'wysiwyg': 1 },

        init: function(editor) {
            editor.on('contentDom', this.onContentDom);
        },

        onContentDom: function() {
            this.editable().on('click', this.plugins.openlink.onClick, this, null, 0);
        },

        _isInLinkBoundary: function(range, link) {
            return !range.getPreviousNode(linkStartEndEvaluator(CKEDITOR), linkStartEndGuard(link), link) ||
                !range.getNextNode(linkStartEndEvaluator(CKEDITOR), linkStartEndGuard(link), link);
        },

        onClick: function(event) {
            var selection = this.getSelection();
            if (!selection) {
                return;
            }

            var range = selection.getRanges()[ 0 ];
            if (!range || !range.collapsed) {
                return;
            }

            var nativeEvent = event.data.$;
            var path = new CKEDITOR.dom.elementPath(new CKEDITOR.dom.element(nativeEvent.target), range.root);

            var link = path.contains('a', true);
            if (!link || this.plugins.openlink._isInLinkBoundary(range, link)) {
                return;
            }

            var href = link.getAttribute('href');
            if (!href || !REG_HREF.test(href)) {
                return;
            }

            event.stop();
            setTimeout(function() {
                window.open(href, '_blank');
            }, 0);
        }
    });
}());
