function updateCard(card_id){
    $.ajax({
        url: '/mtgdb/' + card_id,
        type: 'PUT',
        data: $('#update-card').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};