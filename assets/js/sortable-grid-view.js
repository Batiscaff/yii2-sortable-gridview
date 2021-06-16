(function ($) {
	function initModal(options) {
		if (!options.noModal) {
			$('body').append('<div class="modal fade" id="' + options.id + '-sorting-modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body">' + options.sortingPromptText + '</div></div></div></div>');
		}
	}

	function showModal(options) {
		if (!options.noModal) {
			$('#' + options.id + '-sorting-modal').modal('show');
		}
	}

	function hideModal(options) {
		if (!options.noModal) {
			setTimeout(function() {
				$('#' + options.id + '-sorting-modal').modal('hide');
			}, 0);
		}
	}

	$.SortableGridView = function (options) {
		var defaultOptions = {
			id: 'sortable-grid-view',
			action: 'sortItem',
			sortingPromptText: 'Loading...',
			sortingFailText: 'Fail to sort',
			moveItem: '',
			csrfTokenName: '',
			csrfToken: '',
			noModal: false
		};

		options = $.extend({}, defaultOptions, options);

		initModal(options);

		$('#' + options.id + ' .sortable-grid-view tbody').sortable({
			handle: options.moveItem,
			update : function () {
				showModal(options);

				var serial = [];
				$('#' + options.id + ' .sortable-grid-view tbody.ui-sortable tr').each( function() {
					serial.push($(this).data('key'));
				});

				var length = serial.length;
				var currentRecordNo = 0;
				var successRecordNo = 0;
				var data = [];

				if (length > 0) {
					for(var i=0; i<length; i++) {
						var itemID = serial[i];
						data.push(itemID)
						currentRecordNo++;

						if (currentRecordNo == 500 || i == (length-1)) {
							(function(currentRecordNo) {
								$.ajax({
									'url': options.action,
									'type': 'post',
									'data': {'items': data, [options.csrfTokenName] : options.csrfToken},
									success: function(data) {
										checkSuccess(currentRecordNo);
									},
									error: function(data) {
										$('#' + options.id + '-sorting-modal').modal('hide');
										alert(options.sortingFailText);
									}
								});
							})(currentRecordNo);

							currentRecordNo = 0;
							data = [];
						}
					}
				}

				function checkSuccess(count) {
					successRecordNo += count;

					if (successRecordNo >= length) {
						hideModal(options)
					}
				}
			},
		});
	};
})(jQuery);
