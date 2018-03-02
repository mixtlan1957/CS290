function deleteCard(card_id) {
	$.ajax({
		url: '/mtgdb/card/' + card_id,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};



