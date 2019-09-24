<template>
  <div class="cities">
    <amplify-sign-out></amplify-sign-out>
    <div class="createCity">
      <input v-model="name" name="name" />
      <input v-model="description" name="description" />
      <button v-on:click="createCity()">Create City</button>
    </div>
      <div v-for="(city, index) in cities" v-bind:key="index">
        <h3>{{city.name}}</h3>
        <p>{{city.description}}</p>
      </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { API, graphqlOperation } from 'aws-amplify'
import { listCitys } from '../graphql/queries'
import { createCity } from '../graphql/mutations'
import { onCreateCity } from '../graphql/subscriptions'

export default {
  name: 'City',
  data () {
    return {
      cities: [],
      name: '',
      description: ''
    }
  },
  mounted: async function () {
    let cities = await API.graphql(graphqlOperation(listCitys))
    console.log(cities)
    this.cities = cities.data.listCitys.items

    API.graphql(
      graphqlOperation(onCreateCity)
    ).subscribe({
      next: (eventData) => {
        console.log('eventData: ', eventData)
        const city = eventData.value.data.onCreateCity
        const cities = [...this.cities.filter(content => {
          return ((content.name !== city.name) && (content.description !== city.description))
        }), city]
        this.cities = cities
      }
    })
  },
  methods: {
    createCity: async function () {
      if ((this.name === '') || (this.description === '')) return
      const city = {name: this.name, description: this.description}
      try {
        const cities = [...this.cities, city]
        this.cities = cities
        this.name = ''
        this.description = ''
        await API.graphql(graphqlOperation(createCity, {input: city}))
        console.log('success')
      } catch (error) {
        console.log('error: ', error)
      }
    }
  }

}
</script>
