if (navigator.userAgent.indexOf('PhantomJS') < 0)
  describe("handlebars.binding", function() {
    describe("bind helper", function() {
      describe("inline", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: 123};
          var template = Handlebars.compile("{{bind 'foo'}}");
          var node = Handlebars.parseHTML(template(context))[0];
          context.foo = 321;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(node.textContent).to.equal("321");
            done();
          });
        });
      });

      describe("block", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: 123};
          var template = Handlebars.compile("{{#bind 'foo'}}{{foo}}{{/bind}}");
          var marker = Handlebars.parseHTML(template(context))[0];
          context.foo = 321;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(marker.nextSibling.textContent).to.equal("321");
            done();
          });
        });

        it("should update for object value", function(done) {
          var context = {foo: {bar: 123}};
          var template = Handlebars.compile("{{#bind 'foo'}}{{foo.bar}}{{/bind}}");
          var marker = Handlebars.parseHTML(template(context))[0];
          context.foo.bar = 321;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(marker.nextSibling.textContent).to.equal("321");
            done();
          });
        });

        it("should update for array value", function(done) {
          var context = {foo: [1, 2, 3]};
          var template = Handlebars.compile("{{#bind 'foo'}}{{foo.[0]}}{{/bind}}");
          var marker = Handlebars.parseHTML(template(context))[0];
          context.foo.unshift(0);
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(marker.nextSibling.textContent).to.equal("0");
            done();
          });
        });
      });

      describe("attribute", function() {
        it("should update boolean attribute for primitive value", function(done) {
          var context = {foo: "hello"};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{bind 'foo' attr=true}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = "world";
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div world=""></div>');
            done();
          });
        });

        it("should update normal attribute for primitive value", function(done) {
          var context = {foo: "hello"};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{bind 'foo' attr='bar'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = "world";
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div bar="world"></div>');
            done();
          });
        });

        it("should update class attribute for primitive value", function(done) {
          var context = {foo: "hello"};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{bind 'foo' attr='class'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = "world";
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div class="world"></div>');
            done();
          });
        });
      });
    });

    describe("if helper", function() {
      describe("inline", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: true};
          var template = Handlebars.compile("{{if 'foo' bind=true then='hello' else='world'}}");
          var node = Handlebars.parseHTML(template(context))[0];
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(node.textContent).to.equal("world");
            done();
          });
        });
      });

      describe("block", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: true};
          var template = Handlebars.compile("{{#if 'foo' bind=true}}hello{{else}}world{{/if}}");
          var marker = Handlebars.parseHTML(template(context))[0];
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(marker.nextSibling.textContent).to.equal("world");
            done();
          });
        });
      });

      describe("attribute", function() {
        it("should update boolean attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{if 'foo' bindAttr=true then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div world=""></div>');
            done();
          });
        });

        it("should update normal attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{if 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div bar="world"></div>');
            done();
          });
        });

        it("should update class attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{if 'foo' bindAttr='class' then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div class="world"></div>');
            done();
          });
        });
      });
    });

    describe("unless helper", function() {
      describe("inline", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: true};
          var template = Handlebars.compile("{{unless 'foo' bind=true then='hello' else='world'}}");
          var node = Handlebars.parseHTML(template(context))[0];
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(node.textContent).to.equal("hello");
            done();
          });
        });
      });

      describe("block", function() {
        it("should update for primitive value", function(done) {
          var context = {foo: true};
          var template = Handlebars.compile("{{#unless 'foo' bind=true}}hello{{else}}world{{/unless}}");
          var marker = Handlebars.parseHTML(template(context))[0];
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(marker.nextSibling.textContent).to.equal("hello");
            done();
          });
        });
      });

      describe("attribute", function() {
        it("should update boolean attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{unless 'foo' bindAttr=true then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div hello=""></div>');
            done();
          });
        });

        it("should update normal attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{unless 'foo' bindAttr='bar' then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div bar="hello"></div>');
            done();
          });
        });

        it("should update class attribute for primitive value", function(done) {
          var context = {foo: true};
          var div = document.createElement("div");
          var template = Handlebars.compile("<div {{unless 'foo' bindAttr='class' then='hello' else='world'}}></div>");
          div.appendChild(Handlebars.parseHTML(template(context))[0]);
          context.foo = false;
          Platform.performMicrotaskCheckpoint();

          setTimeout(function() {
            chai.expect(div.innerHTML).to.equal('<div class="hello"></div>');
            done();
          });
        });
      });
    });

    describe("each helper", function() {
      it("should append item", function(done) {
        var context = {foo: [1, 2, 3]};
        var div = document.createElement("div");
        var template = Handlebars.compile("<ul>{{#each foo var='bar' bind=true}}<li>{{bar}}</li>{{/each}}</ul>");
        div.appendChild(Handlebars.parseHTML(template(context))[0]);
        context.foo.push(4);
        Platform.performMicrotaskCheckpoint();

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
        Platform.performMicrotaskCheckpoint();

        setTimeout(function() {
          chai.expect(div.innerHTML).to.equal('<ul><li>1</li><li>2</li></ul>');
          done();
        });
      });
    });
  });
