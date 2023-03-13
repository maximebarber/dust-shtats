<template>
  <DataTable :value="tracks" sortField="artist" :sortOrder="1" class="m-4" resizableColumns columnResizeMode="expand" style="max-width: 100vw;">
    <Column field="artist" header="Artist" :sortable="true" class="dtColumn"></Column>
    <Column field="name" header="Name" :sortable="true" class="dtColumn"></Column>
    <Column field="addedBy" header="Added By" :sortable="true" class="dtColumn"></Column>
    <Column field="tempo" header="Tempo" :sortable="true" class="dtColumn"></Column>
    <Column field="danceability" header="danceability" :sortable="true" class="dtColumn"></Column>
    <Column field="energy" header="energy" :sortable="true" class="dtColumn"></Column>
    <Column field="key" header="key" :sortable="true" class="dtColumn"></Column>
    <Column field="speechiness" header="speechiness" :sortable="true" class="dtColumn"></Column>
    <Column field="instrumentalness" header="instrumentalness" :sortable="true" class="dtColumn"></Column>
    <Column field="liveness" header="liveness" :sortable="true" class="dtColumn"></Column>
    <Column field="duration_ms" header="duration_ms" :sortable="true" class="dtColumn"></Column>
  </DataTable>
</template>

<script>
export default {
  props: {
    tracks: Array,
  }
}
</script>

<style>
.dtColumn {
  max-width: 9vw;
}
</style>