<template>
  <DataTable :value="tracks" sortField="count" :sortOrder="-1" class="m-4">
    <Column field="track.artists.0.name" header="Artist" :sortable="true"></Column>
    <Column field="track.name" header="Name" :sortable="true"></Column>
  </DataTable>
</template>
<script>
export default {
  props: {
    tracks: Array,
  }
}
</script>