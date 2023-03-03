<template>
  <DataTable :value="artists" sortField="count" :sortOrder="-1" class="m-4">
    <Column field="artist" header="Artist" :sortable="true"></Column>
    <Column field="count" header="Count" :sortable="true"></Column>
  </DataTable>
</template>
<script>
export default {
  props: {
    artists: Array,
  }
}
</script>