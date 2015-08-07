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
            var selection = this.getSelection();
            if (!selection) {
                return;
            }

            var ranges = selection.getRanges();
            if (!ranges.length || !ranges[ 0 ].collapsed) {
                return;
            }

            var link = ranges[ 0 ].startPath().contains('a', true);
            if (!link) {
                return;
            }

            var href = link.getAttribute('href');
            if (!href || !REG_HREF.test(href)) {
                return;
            }

            event.stop();
            window.open(href, '_blank');
        }
    });
}());
