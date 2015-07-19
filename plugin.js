(function() {
    'use strict';

    var REG_HREF = /^http(s?):\/\//;

    CKEDITOR.plugins.add('openlink', {
        requires: 'link',

        modes: { 'wysiwyg': 1 },

        init: function(editor) {
            editor.on('contentDom', function() {
                var editable = editor.editable();

                editable.attachListener(editable, 'click', function(evt) {
                    var element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;

                    if (!element || element.isReadOnly() || !element.is('a')) {
                        return;
                    }

                    var href = element.getAttribute('href');

                    if (!href || !REG_HREF.test(href)) {
                        return;
                    }

                    evt.stop();
                    window.open(href, '_blank');
                });
            });
        }
    });
}());
