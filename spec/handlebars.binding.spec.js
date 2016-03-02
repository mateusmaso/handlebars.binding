if (navigator.userAgent.indexOf('PhantomJS') < 0)
  describe("handlebars.binding", function() {
    describe("bind helper", function() {
      describe("inline", function() {
        describe("primitive", function() {
          it("should render", function() {
            var context = {foo: 123};
            var template = Handlebars.compile("{{bind 'foo'}}");
            var node = Handlebars.parseHTML(template(context))[0];
            chai.expect(node.textContent).to.equal("123");
          });

          it("should update", function(done) {
            var context = {foo: 123};
            var template = Handlebars.compile("{{bind 'foo'}}");
            var node = Handlebars.parseHTML(template(context))[0];
            context.foo = 321;

            setTimeout(function() {
              chai.expect(node.textContent).to.equal("321");
              done();
            });
          });
        });
      });

      describe("block", function() {
        describe("primitive", function() {
          it("should render", function() {
            var context = {foo: 123};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            chai.expect(marker.nextSibling.textContent).to.equal("123");
          });

          it("should update", function(done) {
            var context = {foo: 123};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            context.foo = 321;

            setTimeout(function() {
              chai.expect(marker.nextSibling.textContent).to.equal("321");
              done();
            });
          });
        });

        describe("object", function() {
          it("should render", function() {
            var context = {foo: {bar: 123}};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo.bar}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            chai.expect(marker.nextSibling.textContent).to.equal("123");
          });

          it("should update", function(done) {
            var context = {foo: {bar: 123}};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo.bar}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            context.foo.bar = 321;

            setTimeout(function() {
              chai.expect(marker.nextSibling.textContent).to.equal("321");
              done();
            });
          });
        });

        describe("array", function() {
          it("should render", function() {
            var context = {foo: [1, 2, 3]};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo.[0]}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            chai.expect(marker.nextSibling.textContent).to.equal("1");
          });

          it("should update", function(done) {
            var context = {foo: [1, 2, 3]};
            var template = Handlebars.compile("{{#bind 'foo'}}{{foo.[0]}}{{/bind}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            context.foo.unshift(0);

            setTimeout(function() {
              chai.expect(marker.nextSibling.textContent).to.equal("0");
              done();
            });
          });
        });
      });

      describe("attribute", function() {
        describe("primitive", function() {
          describe("boolean-like attribute", function() {
            it("should render", function() {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr=true}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div hello=""></div>');
            });

            it("should update", function(done) {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr=true}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = "world";

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div world=""></div>');
                done();
              });
            });
          });

          describe("regular attribute", function() {
            it("should render", function() {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr='bar'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div bar="hello"></div>');
            });

            it("should update", function(done) {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr='bar'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = "world";

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div bar="world"></div>');
                done();
              });
            });
          })

          describe("class attribute", function() {
            it("should render", function() {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr='class'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div class="hello"></div>');
            });

            it("should update", function(done) {
              var context = {foo: "hello"};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{bind 'foo' attr='class'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = "world";

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div class="world"></div>');
                done();
              });
            });
          });
        });
      });
    });

    describe("if helper", function() {
      describe("inline", function() {
        describe("primitive", function() {
          it("should render", function() {
            var context = {foo: true};
            var template = Handlebars.compile("{{if 'foo' bind=true then='hello' else='world'}}");
            var node = Handlebars.parseHTML(template(context))[0];
            chai.expect(node.textContent).to.equal("hello");
          });

          it("should update", function(done) {
            var context = {foo: true};
            var template = Handlebars.compile("{{if 'foo' bind=true then='hello' else='world'}}");
            var node = Handlebars.parseHTML(template(context))[0];
            context.foo = false;

            setTimeout(function() {
              chai.expect(node.textContent).to.equal("world");
              done();
            });
          });
        });
      });

      describe("block", function() {
        describe("primitive", function() {
          it("should render", function() {
            var context = {foo: true};
            var template = Handlebars.compile("{{#if 'foo' bind=true}}hello{{else}}world{{/if}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            chai.expect(marker.nextSibling.textContent).to.equal("hello");
          });

          it("should update", function(done) {
            var context = {foo: true};
            var template = Handlebars.compile("{{#if 'foo' bind=true}}hello{{else}}world{{/if}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            context.foo = false;

            setTimeout(function() {
              chai.expect(marker.nextSibling.textContent).to.equal("world");
              done();
            });
          });
        });
      });

      describe("attribute", function() {
        describe("primitive", function() {
          describe("boolean-like attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr=true then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div hello=""></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr=true then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div world=""></div>');
                done();
              });
            });
          });

          describe("regular attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div bar="hello"></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div bar="world"></div>');
                done();
              });
            });
          });

          describe("class attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr='class' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div class="hello"></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{if 'foo' bindAttr='class' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div class="world"></div>');
                done();
              });
            });
          });
        });
      });
    });

    describe("unless helper", function() {
      describe("inline", function() {
        describe("primitive", function() {
          it("should update", function(done) {
            var context = {foo: true};
            var template = Handlebars.compile("{{unless 'foo' bind=true then='hello' else='world'}}");
            var node = Handlebars.parseHTML(template(context))[0];
            context.foo = false;

            setTimeout(function() {
              chai.expect(node.textContent).to.equal("hello");
              done();
            });
          });
        });
      });

      describe("block", function() {
        describe("primitive", function() {
          it("should render", function() {
            var context = {foo: true};
            var template = Handlebars.compile("{{#unless 'foo' bind=true}}hello{{else}}world{{/unless}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            chai.expect(marker.nextSibling.textContent).to.equal("world");
          });

          it("should update", function(done) {
            var context = {foo: true};
            var template = Handlebars.compile("{{#unless 'foo' bind=true}}hello{{else}}world{{/unless}}");
            var marker = Handlebars.parseHTML(template(context))[0];
            context.foo = false;

            setTimeout(function() {
              chai.expect(marker.nextSibling.textContent).to.equal("hello");
              done();
            });
          });
        });
      });

      describe("attribute", function() {
        describe("primitive", function() {
          describe("boolean-like attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr=true then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div world=""></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr=true then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div hello=""></div>');
                done();
              });
            });
          });

          describe("regular attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div bar="world"></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div bar="hello"></div>');
                done();
              });
            });
          });

          describe("class attribute", function() {
            it("should render", function() {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr='class' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              chai.expect(div.innerHTML).to.equal('<div class="world"></div>');
            });

            it("should update", function(done) {
              var context = {foo: true};
              var div = document.createElement("div");
              var template = Handlebars.compile("<div {{unless 'foo' bindAttr='class' then='hello' else='world'}}></div>");
              div.appendChild(Handlebars.parseHTML(template(context))[0]);
              context.foo = false;

              setTimeout(function() {
                chai.expect(div.innerHTML).to.equal('<div class="hello"></div>');
                done();
              });
            });
          });
        });
      });
    });

    describe("each helper", function() {
      describe("objects", function() {
        describe("with var", function() {
          it("should append item", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar.value}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.push({value: 4});

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li><li>3</li><li>4</li></ul>');
              done();
            });
          });

          it("should remove item", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar.value}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.pop();

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li></ul>');
              done();
            });
          });

          it("should observe parent context", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}], parent: 123};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar.value}} - {{bind 'parent'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.parent = 321;

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1 - 321</li><li>2 - 321</li><li>3 - 321</li></ul>');
              done();
            });
          });

          it("should update context & index", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bind 'bar.value'}} - {{bind 'index'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo[1].value = 5;
            context.foo.push({value: 4});
            context.foo.splice(0, 1);

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>5 - 0</li><li>3 - 1</li><li>4 - 2</li></ul>');
              done();
            });
          });
        });

        describe("without var", function() {
          it("should append item", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{value}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.push({value: 4});

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li><li>3</li><li>4</li></ul>');
              done();
            });
          });

          it("should remove item", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{value}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.pop();

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li></ul>');
              done();
            });
          });

          it("should observe parent context", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}], parent: 123};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{value}} - {{bind 'parent'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.parent = 321;

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1 - 321</li><li>2 - 321</li><li>3 - 321</li></ul>');
              done();
            });
          });

          it("should update context & index", function(done) {
            var context = {foo: [{value: 1}, {value: 2}, {value: 3}]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{bind 'value'}} - {{bind 'index'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo[1].value = 5;
            context.foo.push({value: 4});
            context.foo.splice(0, 1);

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>5 - 0</li><li>3 - 1</li><li>4 - 2</li></ul>');
              done();
            });
          });
        });
      });

      describe("primitives", function() {
        describe("with var", function() {
          it("should append item", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.push(4);

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li><li>3</li><li>4</li></ul>');
              done();
            });
          });

          it("should remove item", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.pop();

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li></ul>');
              done();
            });
          });

          it("should observe parent context", function(done) {
            var context = {foo: [1, 2, 3], parent: 123};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar}} - {{bind 'parent'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.parent = 321;

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1 - 321</li><li>2 - 321</li><li>3 - 321</li></ul>');
              done();
            });
          });

          it("should update context & index", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bind 'bar'}} - {{bind 'index'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo[1] = 5; // [1, 5, 3]
            context.foo.push(4); // [1, 5, 3, 4]
            context.foo.splice(0, 1); // [5, 3, 4]

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>5 - 0</li><li>3 - 1</li><li>4 - 2</li></ul>');
              done();
            });
          });

          it("should pass exhaustive test", function(done) {
            var context = {foo: [1, 2, 3, 4, 5]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bind 'bar'}} - {{bind 'index'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.splice(2, 1);
            context.foo.splice(2, 1);
            context.foo.splice(2, 1);

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1 - 0</li><li>2 - 1</li></ul>');
              done();
            });
          });
        });

        describe("without var", function() {
          it("should append item", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{$this}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.push(4);

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li><li>3</li><li>4</li></ul>');
              done();
            });
          });

          it("should remove item", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{$this}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo.pop();

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li></ul>');
              done();
            });
          });

          it("should observe parent context", function(done) {
            var context = {foo: [1, 2, 3], parent: 123};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{$this}} - {{bind 'parent'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.parent = 321;

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>1 - 321</li><li>2 - 321</li><li>3 - 321</li></ul>');
              done();
            });
          });

          it("should update context & index", function(done) {
            var context = {foo: [1, 2, 3]};
            var div = document.createElement("div");
            var template = Handlebars.compile("<ul>{{#each foo bind=true}}<li>{{bind '$this'}} - {{bind 'index'}}</li>{{/each}}</ul>");
            div.appendChild(Handlebars.parseHTML(template(context))[0]);
            context.foo[1] = 5; // [1, 5, 3]
            context.foo.push(4); // [1, 5, 3, 4]
            context.foo.splice(0, 1); // [5, 3, 4]

            setTimeout(function() {
              chai.expect(div.innerHTML).to.equal('<ul><li>5 - 0</li><li>3 - 1</li><li>4 - 2</li></ul>');
              done();
            });
          });
        });
      });
    });

    describe("unbind/bind", function() {
      before(function() {
        this.context = {foo: 123};
        this.template = Handlebars.compile("{{bind 'foo'}}");
        this.node = Handlebars.parseHTML(this.template(this.context))[0];
      });

      it("should unbind", function(done) {
        Handlebars.unbind(this.node);
        this.context.foo = 321;

        setTimeout(function() {
          chai.expect(this.node.textContent).to.equal("123");
          done();
        }.bind(this));
      });

      it("should bind", function(done) {
        Handlebars.bind(this.node);
        this.context.foo = 111;

        setTimeout(function() {
          chai.expect(this.node.textContent).to.equal("111");
          done();
        }.bind(this));
      });
    });
  });
