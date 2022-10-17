import MenuItem from "./entities/menu-item.entity";

export class MenuItemsService {

    /* TODO: complete getMenuItems so that it returns a nested menu structure
      Requirements:
      - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
      - it should work for infinite level of depth (children of childrens children of childrens children, ...)
      - verify your solution with `npm run test`
      - do a `git commit && git push` after you are done or when the time limit is over
      - post process your results in javascript
      Hints:
      - open the `src/menu-items/menu-items.service.ts` file
      - partial or not working answers also get graded so make sure you commit what you have
      Sample response on GET /menu:
      ```json
      [
          {
              "id": 1,
              "name": "All events",
              "url": "/events",
              "parentId": null,
              "createdAt": "2021-04-27T15:35:15.000000Z",
              "children": [
                  {
                      "id": 2,
                      "name": "Laracon",
                      "url": "/events/laracon",
                      "parentId": 1,
                      "createdAt": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 3,
                              "name": "Illuminate your knowledge of the laravel code base",
                              "url": "/events/laracon/workshops/illuminate",
                              "parentId": 2,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 4,
                              "name": "The new Eloquent - load more with less",
                              "url": "/events/laracon/workshops/eloquent",
                              "parentId": 2,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  },
                  {
                      "id": 5,
                      "name": "Reactcon",
                      "url": "/events/reactcon",
                      "parentId": 1,
                      "createdAt": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 6,
                              "name": "#NoClass pure functional programming",
                              "url": "/events/reactcon/workshops/noclass",
                              "parentId": 5,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 7,
                              "name": "Navigating the function jungle",
                              "url": "/events/reactcon/workshops/jungle",
                              "parentId": 5,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  }
              ]
          }
      ]
    */

    async getMenuItems() {
        MenuItem.findAll({
        })
            .then(async data => {
                let result = await Promise.all(
                    [
                        data.filter(item => item.parentId == null),
                        data.filter(item => item.parentId != null)
                    ]
                )
                let parentData = result[0].map(parent => {
                    const { id,
                        name,
                        url,
                        parentId,
                        createdAt,
                    } = parent
                    return {
                        id,
                        name,
                        url,
                        parentId,
                        createdAt,
                        children: [{
                            id,
                            name,
                            url,
                            parentId,
                            createdAt,
                        }]
                    }
                });
                let childrenData = result[1];
                await Promise.all(
                    childrenData.map(child => {
                        let index = parentData.findIndex(x => x.id == child.parentId);
                        if (index != -1) {
                            if (parentData[index].children) {
                                parentData[index].children.push(child);
                            } else {
                                parentData[index].children = [child];
                            }

                        }
                    })
                )
                return data;
            })
            .catch(err => {
                return new Error('Get Error');
            });
    }
}
