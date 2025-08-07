const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');

searchInput.addEventListener('input', async function() {
  const query = this.value.trim();
  if (!query) {
    suggestionsBox.innerHTML = '';
    return;
  }
  const res = await fetch(`/listings/api/suggestions?q=${encodeURIComponent(query)}`);
  const listings = await res.json();
  if (listings.length === 0) {
    suggestionsBox.innerHTML = '<div class="list-group-item">No results found</div>';
    return;
  }
  suggestionsBox.innerHTML = listings.map(listing => `
    <a href="/listings/${listing._id}" class="list-group-item list-group-item-action">
      <strong>${listing.title}</strong> - ${listing.location}, ${listing.country}
    </a>
  `).join('');
});

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.innerHTML = '';
  }
});