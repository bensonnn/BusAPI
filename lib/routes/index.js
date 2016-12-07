import router from 'koa-router';

let Router = router();
Router.get('/routes', function *(next) {
  this.body = 'hello its me'
  // trackModel.collection.insertMany(sampleData, (err) => {
  //   console.log(err, 'sucesss');
  // });
});

// Router.get('/latest', async ctx => {
//   let collection = trackModel.find();
//   try {
//     const tracks = await collection.find()
//       .sort({ uploaded: -1 })
//       .limit(20)
//     ctx.body = tracks;
//   } catch (e) {
//     console.error(e);
//   }
// });
//
// Router.get('/popular', async ctx => {
//   let collection = trackModel.find();
//   try {
//     const tracks = await collection.find()
//       .sort({ playcount: -1 })
//       .limit(20)
//     ctx.body = tracks;
//   } catch (e) {
//     console.error(e);
//   }
// });

export default Router.routes();
