(function() {
    'use strict';

    var REG_HREF = /^http(s?):\/\//;

    CKEDITOR.plugins.add('openlink', {
        modes: { 'wysiwyg': 1 },

        init: function(editor) {
            editor.on('contentDom', this.onContentDom);
        },

        onContentDom: function() {
            this.editable().on('click', this.plugins.openlink.onClick, this, null, 0);
        },

        onClick: function(event) {
            var nativeEvent = event.data.$;
            var target = nativeEvent.target;
            if (!target || target.tagName !== 'A') {
                return;
            }

            var href = target.getAttribute('href');
            if (!href || !REG_HREF.test(href)) {
                return;
            }

            var selection = this.getSelection();
            if (!selection) {
                return;
            }

            var ranges = selection.getRanges();
            if (!ranges.length || !ranges[0].collapsed) {
                return;
            }

            event.stop();
            window.open(href, '_blank');
        }
    });
}());
