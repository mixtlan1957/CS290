function deletePlane(plane_id) {
	$.ajax({
		url: '/mtgdb/plane/' + plane_id,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};