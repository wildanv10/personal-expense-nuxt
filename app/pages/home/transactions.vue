<script setup lang="ts">
const { getTransactions, transactions, loading, error } = useTransactions();

onMounted(async () => {
  await getTransactions();
});
</script>

<template>
  <div>
    <h1>Transactions</h1>
    <p>This page will be displayed at the /home/transactions route.</p>
    <hr />
    <p>"transactions:"{{ transactions }}</p>
    <hr />
    <p>"loading:"{{ loading }}</p>
    <hr />
    <p>"error:"{{ error }}</p>
  </div>
</template>
