function deleteCardFromDeck(card_id) {
	$.ajax({
		url: '/mtgdb/displayCardsInDeck/' + card_id,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};