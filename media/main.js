"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // node_modules/decode-named-character-reference/index.dom.js
  var element = document.createElement("i");
  function decodeNamedCharacterReference(value) {
    const characterReference2 = "&" + value + ";";
    element.innerHTML = characterReference2;
    const character = element.textContent;
    if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") {
      return false;
    }
    return character === characterReference2 ? false : character;
  }

  // node_modules/micromark-util-chunked/index.js
  function splice(list2, start, remove, items) {
    const end = list2.length;
    let chunkStart = 0;
    let parameters;
    if (start < 0) {
      start = -start > end ? 0 : end + start;
    } else {
      start = start > end ? end : start;
    }
    remove = remove > 0 ? remove : 0;
    if (items.length < 1e4) {
      parameters = Array.from(items);
      parameters.unshift(start, remove);
      list2.splice(...parameters);
    } else {
      if (remove) list2.splice(start, remove);
      while (chunkStart < items.length) {
        parameters = items.slice(chunkStart, chunkStart + 1e4);
        parameters.unshift(start, 0);
        list2.splice(...parameters);
        chunkStart += 1e4;
        start += 1e4;
      }
    }
  }
  function push(list2, items) {
    if (list2.length > 0) {
      splice(list2, list2.length, 0, items);
      return list2;
    }
    return items;
  }

  // node_modules/micromark-util-combine-extensions/index.js
  var hasOwnProperty = {}.hasOwnProperty;
  function combineExtensions(extensions) {
    const all = {};
    let index = -1;
    while (++index < extensions.length) {
      syntaxExtension(all, extensions[index]);
    }
    return all;
  }
  function syntaxExtension(all, extension) {
    let hook;
    for (hook in extension) {
      const maybe = hasOwnProperty.call(all, hook) ? all[hook] : void 0;
      const left = maybe || (all[hook] = {});
      const right = extension[hook];
      let code;
      if (right) {
        for (code in right) {
          if (!hasOwnProperty.call(left, code)) left[code] = [];
          const value = right[code];
          constructs(
            // @ts-expect-error Looks like a list.
            left[code],
            Array.isArray(value) ? value : value ? [value] : []
          );
        }
      }
    }
  }
  function constructs(existing, list2) {
    let index = -1;
    const before = [];
    while (++index < list2.length) {
      ;
      (list2[index].add === "after" ? existing : before).push(list2[index]);
    }
    splice(existing, 0, 0, before);
  }

  // node_modules/micromark-util-normalize-identifier/index.js
  function normalizeIdentifier(value) {
    return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
  }

  // node_modules/micromark-util-character/index.js
  var asciiAlpha = regexCheck(/[A-Za-z]/);
  var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  function asciiControl(code) {
    return (
      // Special whitespace codes (which have negative values), C0 and Control
      // character DEL
      code !== null && (code < 32 || code === 127)
    );
  }
  var asciiDigit = regexCheck(/\d/);
  var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  function markdownLineEnding(code) {
    return code !== null && code < -2;
  }
  function markdownLineEndingOrSpace(code) {
    return code !== null && (code < 0 || code === 32);
  }
  function markdownSpace(code) {
    return code === -2 || code === -1 || code === 32;
  }
  var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
  var unicodeWhitespace = regexCheck(/\s/);
  function regexCheck(regex) {
    return check;
    function check(code) {
      return code !== null && code > -1 && regex.test(String.fromCharCode(code));
    }
  }

  // node_modules/micromark-factory-space/index.js
  function factorySpace(effects, ok, type, max) {
    const limit = max ? max - 1 : Infinity;
    let size = 0;
    return start;
    function start(code) {
      if (markdownSpace(code)) {
        effects.enter(type);
        return prefix(code);
      }
      return ok(code);
    }
    function prefix(code) {
      if (markdownSpace(code) && size++ < limit) {
        effects.consume(code);
        return prefix;
      }
      effects.exit(type);
      return ok(code);
    }
  }
  function factorySpaceMinMax(effects, ok, nok, type, min, max) {
    let size = 0;
    return start;
    function start(code) {
      if (max > 0 && markdownSpace(code)) {
        effects.enter(type);
        return prefix(code);
      }
      return after(code);
    }
    function prefix(code) {
      if (markdownSpace(code) && size < max) {
        effects.consume(code);
        size++;
        return prefix;
      }
      effects.exit(type);
      return after(code);
    }
    function after(code) {
      return size >= min ? ok(code) : nok(code);
    }
  }

  // node_modules/micromark/lib/initialize/content.js
  var content = {
    tokenize: initializeContent
  };
  function initializeContent(effects) {
    const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
    let previous3;
    return contentStart;
    function afterContentStartConstruct(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return factorySpace(effects, contentStart, "linePrefix");
    }
    function paragraphInitial(code) {
      effects.enter("paragraph");
      return lineStart(code);
    }
    function lineStart(code) {
      const token = effects.enter("chunkText", {
        contentType: "text",
        previous: previous3
      });
      if (previous3) {
        previous3.next = token;
      }
      previous3 = token;
      return data(code);
    }
    function data(code) {
      if (code === null) {
        effects.exit("chunkText");
        effects.exit("paragraph");
        effects.consume(code);
        return;
      }
      if (markdownLineEnding(code)) {
        effects.consume(code);
        effects.exit("chunkText");
        return lineStart;
      }
      effects.consume(code);
      return data;
    }
  }

  // node_modules/micromark-util-edit-map/index.js
  var EditMap = class {
    /**
     * Create a new edit map.
     *
     * @returns
     *   New instance.
     */
    constructor() {
      this.index = /* @__PURE__ */ new Map();
      this.map = [];
    }
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     *   Index at which to apply the edit.
     * @param {number} remove
     *   Count of items to remove at the index.
     * @param {Array<Event>} add
     *   Items to add at the index.
     * @returns {undefined}
     *   Nothing.
     */
    add(index, remove, add) {
      addImplementation(this, index, remove, add, false);
    }
    /**
     * Create an edit: but insert `add` before existing additions, instead of
     * after them.
     *
     * @param {number} index
     *   Index at which to apply the edit.
     * @param {number} remove
     *   Count of items to remove at the index.
     * @param {Array<Event>} add
     *   Items to add at the index.
     * @returns {undefined}
     *   Nothing.
     */
    addBefore(index, remove, add) {
      addImplementation(this, index, remove, add, true);
    }
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     *   List of events to apply the edits to.
     * @returns {undefined}
     *   Nothing.
     */
    consume(events) {
      this.map.sort(function(a, b3) {
        return a[0] - b3[0];
      });
      if (this.map.length === 0) {
        return;
      }
      let index = this.map.length;
      const vecs = [];
      while (index > 0) {
        index -= 1;
        vecs.push(events.slice(this.map[index][0] + this.map[index][1]), this.map[index][2]);
        events.length = this.map[index][0];
      }
      vecs.push(events.slice());
      events.length = 0;
      let slice = vecs.pop();
      while (slice) {
        for (const element2 of slice) {
          events.push(element2);
        }
        slice = vecs.pop();
      }
      this.map.length = 0;
      this.index.clear();
    }
  };
  function addImplementation(editMap, at3, remove, add, before) {
    if (remove === 0 && add.length === 0) {
      return;
    }
    const existing = editMap.index.get(at3);
    if (existing) {
      existing[1] += remove;
      if (before) {
        add.push(...existing[2]);
        existing[2] = add;
      } else {
        existing[2].push(...add);
      }
      return;
    }
    const change = [at3, remove, add];
    editMap.map.push(change);
    editMap.index.set(at3, change);
  }

  // node_modules/micromark/lib/initialize/document.js
  var document2 = {
    tokenize: initializeDocument
  };
  var containerConstruct = {
    tokenize: tokenizeContainer
  };
  function initializeDocument(effects) {
    const self = this;
    const stack = [];
    let continued = 0;
    let childFlow;
    let childToken;
    let lineStartOffset;
    return start;
    function start(code) {
      if (continued < stack.length) {
        const item = stack[continued];
        self.containerState = item[1];
        return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
      }
      return checkNewContainers(code);
    }
    function documentContinue(code) {
      continued++;
      if (self.containerState._closeFlow) {
        self.containerState._closeFlow = void 0;
        if (childFlow) {
          closeFlow();
        }
        const indexBeforeExits = self.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let point;
        while (indexBeforeFlow--) {
          if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
            point = self.events[indexBeforeFlow][1].end;
            break;
          }
        }
        exitContainers(continued);
        let index = indexBeforeExits;
        while (index < self.events.length) {
          self.events[index][1].end = {
            ...point
          };
          index++;
        }
        const editMap = new EditMap();
        editMap.add(indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
        editMap.add(indexBeforeExits, index - indexBeforeExits, []);
        editMap.consume(self.events);
        return checkNewContainers(code);
      }
      return start(code);
    }
    function checkNewContainers(code) {
      if (continued === stack.length) {
        if (!childFlow) {
          return documentContinued(code);
        }
        if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
          return flowStart(code);
        }
        self.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
      }
      self.containerState = {};
      return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
    }
    function thereIsANewContainer(code) {
      if (childFlow) {
        closeFlow();
      }
      exitContainers(continued);
      return documentContinued(code);
    }
    function thereIsNoNewContainer(code) {
      self.parser.lazy[self.now().line] = continued !== stack.length;
      lineStartOffset = self.now().offset;
      return flowStart(code);
    }
    function documentContinued(code) {
      self.containerState = {};
      return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
    }
    function containerContinue(code) {
      continued++;
      stack.push([self.currentConstruct, self.containerState]);
      return documentContinued(code);
    }
    function flowStart(code) {
      if (code === null) {
        if (childFlow) {
          closeFlow();
        }
        exitContainers(0);
        effects.consume(code);
        return;
      }
      childFlow = childFlow || self.parser.flow(self.now());
      effects.enter("chunkFlow", {
        _tokenizer: childFlow,
        contentType: "flow",
        previous: childToken
      });
      return flowContinue(code);
    }
    function flowContinue(code) {
      if (code === null) {
        writeToChild(effects.exit("chunkFlow"), true);
        exitContainers(0);
        effects.consume(code);
        return;
      }
      if (markdownLineEnding(code)) {
        effects.consume(code);
        writeToChild(effects.exit("chunkFlow"));
        continued = 0;
        self.interrupt = void 0;
        return start;
      }
      effects.consume(code);
      return flowContinue;
    }
    function writeToChild(token, endOfFile) {
      const stream = self.sliceStream(token);
      if (endOfFile) {
        stream.push(null);
      }
      token.previous = childToken;
      if (childToken) {
        childToken.next = token;
      }
      childToken = token;
      childFlow.defineSkip(token.start);
      childFlow.write(stream);
      if (self.parser.lazy[token.start.line]) {
        let index = childFlow.events.length;
        while (index--) {
          if (
            // The token starts before the line ending…
            childFlow.events[index][1].start.offset < lineStartOffset && // …and either is not ended yet…
            (!childFlow.events[index][1].end || // …or ends after it.
            childFlow.events[index][1].end.offset > lineStartOffset)
          ) {
            return;
          }
        }
        const indexBeforeExits = self.events.length;
        let indexBeforeFlow = indexBeforeExits;
        let seen;
        let point;
        while (indexBeforeFlow--) {
          if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
            if (seen) {
              point = self.events[indexBeforeFlow][1].end;
              break;
            }
            seen = true;
          }
        }
        exitContainers(continued);
        index = indexBeforeExits;
        while (index < self.events.length) {
          self.events[index][1].end = {
            ...point
          };
          index++;
        }
        const editMap = new EditMap();
        editMap.add(indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits));
        editMap.add(indexBeforeExits, index - indexBeforeExits, []);
        editMap.consume(self.events);
      }
    }
    function exitContainers(size) {
      let index = stack.length;
      while (index-- > size) {
        const entry = stack[index];
        self.containerState = entry[1];
        entry[0].exit.call(self, effects);
      }
      stack.length = size;
    }
    function closeFlow() {
      childFlow.write([null]);
      childToken = void 0;
      childFlow = void 0;
      self.containerState._closeFlow = void 0;
    }
  }
  function tokenizeContainer(effects, ok, nok) {
    return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
  }

  // node_modules/micromark-util-classify-character/index.js
  function classifyCharacter(code) {
    if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) {
      return 1;
    }
    if (unicodePunctuation(code)) {
      return 2;
    }
  }

  // node_modules/micromark-util-resolve-all/index.js
  function resolveAll(constructs2, events, context) {
    const called = [];
    let index = -1;
    while (++index < constructs2.length) {
      const resolve = constructs2[index].resolveAll;
      if (resolve && !called.includes(resolve)) {
        events = resolve(events, context);
        called.push(resolve);
      }
    }
    return events;
  }

  // node_modules/micromark-core-commonmark/lib/attention.js
  var attention = {
    name: "attention",
    resolveAll: resolveAllAttention,
    tokenize: tokenizeAttention
  };
  function resolveAllAttention(events, context) {
    let index = -1;
    let nextEvents;
    while (++index < events.length) {
      if (events[index][0] === "enter" && events[index][1].type === "attentionSequence" && events[index][1]._close) {
        let open2 = index;
        while (open2--) {
          if (events[open2][0] === "exit" && events[open2][1].type === "attentionSequence" && events[open2][1]._open && // If the markers are the same:
          context.sliceSerialize(events[open2][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
            if ((events[open2][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open2][1].end.offset - events[open2][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) {
              continue;
            }
            const use = events[open2][1].end.offset - events[open2][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
            const start = {
              ...events[open2][1].end
            };
            const end = {
              ...events[index][1].start
            };
            movePoint(start, -use);
            movePoint(end, use);
            const openingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start,
              end: {
                ...events[open2][1].end
              }
            };
            const closingSequence = {
              type: use > 1 ? "strongSequence" : "emphasisSequence",
              start: {
                ...events[index][1].start
              },
              end
            };
            const text4 = {
              type: use > 1 ? "strongText" : "emphasisText",
              start: {
                ...events[open2][1].end
              },
              end: {
                ...events[index][1].start
              }
            };
            const group = {
              type: use > 1 ? "strong" : "emphasis",
              start: {
                ...openingSequence.start
              },
              end: {
                ...closingSequence.end
              }
            };
            events[open2][1].end = {
              ...openingSequence.start
            };
            events[index][1].start = {
              ...closingSequence.end
            };
            nextEvents = [];
            if (events[open2][1].end.offset - events[open2][1].start.offset) {
              nextEvents = push(nextEvents, [["enter", events[open2][1], context], ["exit", events[open2][1], context]]);
            }
            nextEvents = push(nextEvents, [["enter", group, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text4, context]]);
            nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open2 + 1, index), context));
            nextEvents = push(nextEvents, [["exit", text4, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group, context]]);
            let offset = 0;
            if (events[index][1].end.offset - events[index][1].start.offset) {
              offset = 2;
              nextEvents = push(nextEvents, [["enter", events[index][1], context], ["exit", events[index][1], context]]);
            }
            splice(events, open2 - 1, index - open2 + 3, nextEvents);
            index = open2 + nextEvents.length - offset - 2;
            break;
          }
        }
      }
    }
    index = -1;
    while (++index < events.length) {
      if (events[index][1].type === "attentionSequence") {
        events[index][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeAttention(effects, ok) {
    const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
    const previous3 = this.previous;
    const before = classifyCharacter(previous3);
    let marker;
    return start;
    function start(code) {
      marker = code;
      effects.enter("attentionSequence");
      return inside(code);
    }
    function inside(code) {
      if (code === marker) {
        effects.consume(code);
        return inside;
      }
      const token = effects.exit("attentionSequence");
      const after = classifyCharacter(code);
      const open2 = !after || after === 2 && before || attentionMarkers2.includes(code) && code !== 42 && code !== 95;
      const close2 = !before || before === 2 && after || attentionMarkers2.includes(previous3) && previous3 !== 42 && previous3 !== 95;
      token._open = Boolean(marker === 42 ? open2 : open2 && (before || !close2));
      token._close = Boolean(marker === 42 ? close2 : close2 && (after || !open2));
      return ok(code);
    }
  }
  function movePoint(point, offset) {
    point.column += offset;
    point.offset += offset;
    point._bufferIndex += offset;
  }

  // node_modules/micromark-core-commonmark/lib/autolink.js
  var autolink = {
    name: "autolink",
    tokenize: tokenizeAutolink
  };
  function tokenizeAutolink(effects, ok, nok) {
    let size = 0;
    return start;
    function start(code) {
      effects.enter("autolink");
      effects.enter("autolinkMarker");
      effects.consume(code);
      effects.exit("autolinkMarker");
      effects.enter("autolinkProtocol");
      return open2;
    }
    function open2(code) {
      if (asciiAlpha(code)) {
        effects.consume(code);
        return schemeOrEmailAtext;
      }
      if (code === 64) {
        return nok(code);
      }
      return emailAtext(code);
    }
    function schemeOrEmailAtext(code) {
      if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
        size = 1;
        return schemeInsideOrEmailAtext(code);
      }
      return emailAtext(code);
    }
    function schemeInsideOrEmailAtext(code) {
      if (code === 58) {
        effects.consume(code);
        size = 0;
        return urlInside;
      }
      if ((code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32) {
        effects.consume(code);
        return schemeInsideOrEmailAtext;
      }
      size = 0;
      return emailAtext(code);
    }
    function urlInside(code) {
      if (code === 62) {
        effects.exit("autolinkProtocol");
        effects.enter("autolinkMarker");
        effects.consume(code);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok;
      }
      if (code === null || code === 32 || code === 60 || asciiControl(code)) {
        return nok(code);
      }
      effects.consume(code);
      return urlInside;
    }
    function emailAtext(code) {
      if (code === 64) {
        effects.consume(code);
        return emailAtSignOrDot;
      }
      if (asciiAtext(code)) {
        effects.consume(code);
        return emailAtext;
      }
      return nok(code);
    }
    function emailAtSignOrDot(code) {
      return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
    }
    function emailLabel(code) {
      if (code === 46) {
        effects.consume(code);
        size = 0;
        return emailAtSignOrDot;
      }
      if (code === 62) {
        effects.exit("autolinkProtocol").type = "autolinkEmail";
        effects.enter("autolinkMarker");
        effects.consume(code);
        effects.exit("autolinkMarker");
        effects.exit("autolink");
        return ok;
      }
      return emailValue(code);
    }
    function emailValue(code) {
      if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
        const next = code === 45 ? emailValue : emailLabel;
        effects.consume(code);
        return next;
      }
      return nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/blank-line.js
  var blankLine = {
    partial: true,
    tokenize: tokenizeBlankLine
  };
  function tokenizeBlankLine(effects, ok, nok) {
    return start;
    function start(code) {
      return markdownSpace(code) ? factorySpace(effects, after, "linePrefix")(code) : after(code);
    }
    function after(code) {
      return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/block-quote.js
  var blockQuote = {
    continuation: {
      tokenize: tokenizeBlockQuoteContinuation
    },
    exit,
    name: "blockQuote",
    tokenize: tokenizeBlockQuoteStart
  };
  function tokenizeBlockQuoteStart(effects, ok, nok) {
    const self = this;
    return start;
    function start(code) {
      if (code === 62) {
        const state = self.containerState;
        if (!state.open) {
          effects.enter("blockQuote", {
            _container: true
          });
          state.open = true;
        }
        effects.enter("blockQuotePrefix");
        effects.enter("blockQuoteMarker");
        effects.consume(code);
        effects.exit("blockQuoteMarker");
        return after;
      }
      return nok(code);
    }
    function after(code) {
      if (markdownSpace(code)) {
        effects.enter("blockQuotePrefixWhitespace");
        effects.consume(code);
        effects.exit("blockQuotePrefixWhitespace");
        effects.exit("blockQuotePrefix");
        return ok;
      }
      effects.exit("blockQuotePrefix");
      return ok(code);
    }
  }
  function tokenizeBlockQuoteContinuation(effects, ok, nok) {
    const self = this;
    return contStart;
    function contStart(code) {
      if (markdownSpace(code)) {
        return factorySpace(effects, contBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
      }
      return contBefore(code);
    }
    function contBefore(code) {
      return effects.attempt(blockQuote, ok, nok)(code);
    }
  }
  function exit(effects) {
    effects.exit("blockQuote");
  }

  // node_modules/micromark-core-commonmark/lib/character-escape.js
  var characterEscape = {
    name: "characterEscape",
    tokenize: tokenizeCharacterEscape
  };
  function tokenizeCharacterEscape(effects, ok, nok) {
    return start;
    function start(code) {
      effects.enter("characterEscape");
      effects.enter("escapeMarker");
      effects.consume(code);
      effects.exit("escapeMarker");
      return inside;
    }
    function inside(code) {
      if (asciiPunctuation(code)) {
        effects.enter("characterEscapeValue");
        effects.consume(code);
        effects.exit("characterEscapeValue");
        effects.exit("characterEscape");
        return ok;
      }
      return nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/character-reference.js
  var characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
  function tokenizeCharacterReference(effects, ok, nok) {
    const self = this;
    let size = 0;
    let max;
    let test;
    return start;
    function start(code) {
      effects.enter("characterReference");
      effects.enter("characterReferenceMarker");
      effects.consume(code);
      effects.exit("characterReferenceMarker");
      return open2;
    }
    function open2(code) {
      if (code === 35) {
        effects.enter("characterReferenceMarkerNumeric");
        effects.consume(code);
        effects.exit("characterReferenceMarkerNumeric");
        return numeric;
      }
      effects.enter("characterReferenceValue");
      max = 31;
      test = asciiAlphanumeric;
      return value(code);
    }
    function numeric(code) {
      if (code === 88 || code === 120) {
        effects.enter("characterReferenceMarkerHexadecimal");
        effects.consume(code);
        effects.exit("characterReferenceMarkerHexadecimal");
        effects.enter("characterReferenceValue");
        max = 6;
        test = asciiHexDigit;
        return value;
      }
      effects.enter("characterReferenceValue");
      max = 7;
      test = asciiDigit;
      return value(code);
    }
    function value(code) {
      if (code === 59 && size) {
        const token = effects.exit("characterReferenceValue");
        if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token))) {
          return nok(code);
        }
        effects.enter("characterReferenceMarker");
        effects.consume(code);
        effects.exit("characterReferenceMarker");
        effects.exit("characterReference");
        return ok;
      }
      if (test(code) && size++ < max) {
        effects.consume(code);
        return value;
      }
      return nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/partial-non-lazy-continuation.js
  var nonLazyContinuation = {
    partial: true,
    tokenize: tokenizeNonLazyContinuation
  };
  function tokenizeNonLazyContinuation(effects, ok, nok) {
    const self = this;
    return start;
    function start(code) {
      if (code === null) {
        return nok(code);
      }
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return after;
    }
    function after(code) {
      return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-fenced.js
  var codeFenced = {
    concrete: true,
    name: "codeFenced",
    tokenize: tokenizeCodeFenced
  };
  function tokenizeCodeFenced(effects, ok, nok) {
    const self = this;
    const closeStart = {
      partial: true,
      tokenize: tokenizeCloseStart
    };
    let initialPrefix = 0;
    let sizeOpen = 0;
    let marker;
    return start;
    function start(code) {
      return beforeSequenceOpen(code);
    }
    function beforeSequenceOpen(code) {
      const tail = self.events[self.events.length - 1];
      initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
      marker = code;
      effects.enter("codeFenced");
      effects.enter("codeFencedFence");
      effects.enter("codeFencedFenceSequence");
      return sequenceOpen(code);
    }
    function sequenceOpen(code) {
      if (code === marker) {
        sizeOpen++;
        effects.consume(code);
        return sequenceOpen;
      }
      if (sizeOpen < 3) {
        return nok(code);
      }
      effects.exit("codeFencedFenceSequence");
      return markdownSpace(code) ? factorySpace(effects, infoBefore, "whitespace")(code) : infoBefore(code);
    }
    function infoBefore(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("codeFencedFence");
        return self.interrupt ? ok(code) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
      }
      effects.enter("codeFencedFenceInfo");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return info(code);
    }
    function info(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return infoBefore(code);
      }
      if (markdownSpace(code)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceInfo");
        return factorySpace(effects, metaBefore, "whitespace")(code);
      }
      if (code === 96 && code === marker) {
        return nok(code);
      }
      effects.consume(code);
      return info;
    }
    function metaBefore(code) {
      if (code === null || markdownLineEnding(code)) {
        return infoBefore(code);
      }
      effects.enter("codeFencedFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code);
    }
    function meta(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("chunkString");
        effects.exit("codeFencedFenceMeta");
        return infoBefore(code);
      }
      if (code === 96 && code === marker) {
        return nok(code);
      }
      effects.consume(code);
      return meta;
    }
    function atNonLazyBreak(code) {
      return effects.attempt(closeStart, after, contentBefore)(code);
    }
    function contentBefore(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return contentStart;
    }
    function contentStart(code) {
      return initialPrefix > 0 && markdownSpace(code) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code) : beforeContentChunk(code);
    }
    function beforeContentChunk(code) {
      if (code === null || markdownLineEnding(code)) {
        return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
      }
      effects.enter("codeFlowValue");
      return contentChunk(code);
    }
    function contentChunk(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("codeFlowValue");
        return beforeContentChunk(code);
      }
      effects.consume(code);
      return contentChunk;
    }
    function after(code) {
      effects.exit("codeFenced");
      return ok(code);
    }
    function tokenizeCloseStart(effects2, ok2, nok2) {
      let size = 0;
      return startBefore;
      function startBefore(code) {
        effects2.enter("lineEnding");
        effects2.consume(code);
        effects2.exit("lineEnding");
        return start2;
      }
      function start2(code) {
        effects2.enter("codeFencedFence");
        return markdownSpace(code) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : beforeSequenceClose(code);
      }
      function beforeSequenceClose(code) {
        if (code === marker) {
          effects2.enter("codeFencedFenceSequence");
          return sequenceClose(code);
        }
        return nok2(code);
      }
      function sequenceClose(code) {
        if (code === marker) {
          size++;
          effects2.consume(code);
          return sequenceClose;
        }
        if (size >= sizeOpen) {
          effects2.exit("codeFencedFenceSequence");
          return markdownSpace(code) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code) : sequenceCloseAfter(code);
        }
        return nok2(code);
      }
      function sequenceCloseAfter(code) {
        if (code === null || markdownLineEnding(code)) {
          effects2.exit("codeFencedFence");
          return ok2(code);
        }
        return nok2(code);
      }
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-indented.js
  var codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  var furtherStart = {
    partial: true,
    tokenize: tokenizeFurtherStart
  };
  function tokenizeCodeIndented(effects, ok, nok) {
    return start;
    function start(code) {
      effects.enter("codeIndented");
      return factorySpaceMinMax(effects, atBreak, nok, "linePrefix", 4, 4)(code);
    }
    function atBreak(code) {
      if (code === null) {
        return after(code);
      }
      if (markdownLineEnding(code)) {
        return effects.attempt(furtherStart, atBreak, after)(code);
      }
      effects.enter("codeFlowValue");
      return inside(code);
    }
    function inside(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("codeFlowValue");
        return atBreak(code);
      }
      effects.consume(code);
      return inside;
    }
    function after(code) {
      effects.exit("codeIndented");
      return ok(code);
    }
  }
  function tokenizeFurtherStart(effects, ok, nok) {
    const self = this;
    return furtherStart2;
    function furtherStart2(code) {
      if (self.parser.lazy[self.now().line]) {
        return nok(code);
      }
      if (markdownLineEnding(code)) {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        return furtherStart2;
      }
      return factorySpaceMinMax(effects, ok, onNotEnoughPrefix, "linePrefix", 4, 4)(code);
    }
    function onNotEnoughPrefix(code) {
      return markdownLineEnding(code) ? furtherStart2(code) : nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/code-text.js
  var codeText = {
    name: "codeText",
    previous,
    resolve: resolveCodeText,
    tokenize: tokenizeCodeText
  };
  function resolveCodeText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index = headEnterIndex;
      while (++index < tailExitIndex) {
        if (events[index][1].type === "codeTextData") {
          events[headEnterIndex][1].type = "codeTextPadding";
          events[tailExitIndex][1].type = "codeTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index = headEnterIndex - 1;
    tailExitIndex++;
    while (++index <= tailExitIndex) {
      if (enter === void 0) {
        if (index !== tailExitIndex && events[index][1].type !== "lineEnding") {
          enter = index;
        }
      } else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
        events[enter][1].type = "codeTextData";
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          tailExitIndex -= index - enter - 2;
          index = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous(code) {
    return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
  }
  function tokenizeCodeText(effects, ok, nok) {
    const self = this;
    let sizeOpen = 0;
    let size;
    let token;
    return start;
    function start(code) {
      effects.enter("codeText");
      effects.enter("codeTextSequence");
      return sequenceOpen(code);
    }
    function sequenceOpen(code) {
      if (code === 96) {
        effects.consume(code);
        sizeOpen++;
        return sequenceOpen;
      }
      effects.exit("codeTextSequence");
      return between(code);
    }
    function between(code) {
      if (code === null) {
        return nok(code);
      }
      if (code === 32) {
        effects.enter("space");
        effects.consume(code);
        effects.exit("space");
        return between;
      }
      if (code === 96) {
        token = effects.enter("codeTextSequence");
        size = 0;
        return sequenceClose(code);
      }
      if (markdownLineEnding(code)) {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        return between;
      }
      effects.enter("codeTextData");
      return data(code);
    }
    function data(code) {
      if (code === null || code === 32 || code === 96 || markdownLineEnding(code)) {
        effects.exit("codeTextData");
        return between(code);
      }
      effects.consume(code);
      return data;
    }
    function sequenceClose(code) {
      if (code === 96) {
        effects.consume(code);
        size++;
        return sequenceClose;
      }
      if (size === sizeOpen) {
        effects.exit("codeTextSequence");
        effects.exit("codeText");
        return ok(code);
      }
      token.type = "codeTextData";
      return data(code);
    }
  }

  // node_modules/micromark-util-subtokenize/lib/splice-buffer.js
  var SpliceBuffer = class {
    /**
     * @param {ReadonlyArray<T> | null | undefined} [initial]
     *   Initial items (optional).
     * @returns
     *   Splice buffer.
     */
    constructor(initial) {
      this.left = initial ? [...initial] : [];
      this.right = [];
    }
    /**
     * Array access;
     * does not move the cursor.
     *
     * @param {number} index
     *   Index.
     * @return {T}
     *   Item.
     */
    get(index) {
      if (index < 0 || index >= this.left.length + this.right.length) {
        throw new RangeError("Cannot access index `" + index + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
      }
      if (index < this.left.length) return this.left[index];
      return this.right[this.right.length - index + this.left.length - 1];
    }
    /**
     * The length of the splice buffer, one greater than the largest index in the
     * array.
     */
    get length() {
      return this.left.length + this.right.length;
    }
    /**
     * Remove and return `list[0]`;
     * moves the cursor to `0`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    shift() {
      this.setCursor(0);
      return this.right.pop();
    }
    /**
     * Slice the buffer to get an array;
     * does not move the cursor.
     *
     * @param {number} start
     *   Start.
     * @param {number | null | undefined} [end]
     *   End (optional).
     * @returns {Array<T>}
     *   Array of items.
     */
    slice(start, end) {
      const stop = end === null || end === void 0 ? Number.POSITIVE_INFINITY : end;
      if (stop < this.left.length) {
        return this.left.slice(start, stop);
      }
      if (start > this.left.length) {
        return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
      }
      return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
    }
    /**
     * Mimics the behavior of Array.prototype.splice() except for the change of
     * interface necessary to avoid segfaults when patching in very large arrays.
     *
     * This operation moves cursor is moved to `start` and results in the cursor
     * placed after any inserted items.
     *
     * @param {number} start
     *   Start;
     *   zero-based index at which to start changing the array;
     *   negative numbers count backwards from the end of the array and values
     *   that are out-of bounds are clamped to the appropriate end of the array.
     * @param {number | null | undefined} [deleteCount=0]
     *   Delete count (default: `0`);
     *   maximum number of elements to delete, starting from start.
     * @param {Array<T> | null | undefined} [items=[]]
     *   Items to include in place of the deleted items (default: `[]`).
     * @return {Array<T>}
     *   Any removed items.
     */
    splice(start, deleteCount, items) {
      const count = deleteCount || 0;
      this.setCursor(Math.trunc(start));
      const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
      if (items) chunkedPush(this.left, items);
      return removed.reverse();
    }
    /**
     * Remove and return the highest-numbered item in the array, so
     * `list[list.length - 1]`;
     * Moves the cursor to `length`.
     *
     * @returns {T | undefined}
     *   Item, optional.
     */
    pop() {
      this.setCursor(Number.POSITIVE_INFINITY);
      return this.left.pop();
    }
    /**
     * Inserts a single item to the high-numbered side of the array;
     * moves the cursor to `length`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    push(item) {
      this.setCursor(Number.POSITIVE_INFINITY);
      this.left.push(item);
    }
    /**
     * Inserts many items to the high-numbered side of the array.
     * Moves the cursor to `length`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    pushMany(items) {
      this.setCursor(Number.POSITIVE_INFINITY);
      chunkedPush(this.left, items);
    }
    /**
     * Inserts a single item to the low-numbered side of the array;
     * Moves the cursor to `0`.
     *
     * @param {T} item
     *   Item.
     * @returns {undefined}
     *   Nothing.
     */
    unshift(item) {
      this.setCursor(0);
      this.right.push(item);
    }
    /**
     * Inserts many items to the low-numbered side of the array;
     * moves the cursor to `0`.
     *
     * @param {Array<T>} items
     *   Items.
     * @returns {undefined}
     *   Nothing.
     */
    unshiftMany(items) {
      this.setCursor(0);
      chunkedPush(this.right, items.reverse());
    }
    /**
     * Move the cursor to a specific position in the array. Requires
     * time proportional to the distance moved.
     *
     * If `n < 0`, the cursor will end up at the beginning.
     * If `n > length`, the cursor will end up at the end.
     *
     * @param {number} n
     *   Position.
     * @return {undefined}
     *   Nothing.
     */
    setCursor(n) {
      if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0) return;
      if (n < this.left.length) {
        const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
        chunkedPush(this.right, removed.reverse());
      } else {
        const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
        chunkedPush(this.left, removed.reverse());
      }
    }
  };
  function chunkedPush(list2, right) {
    let chunkStart = 0;
    if (right.length < 1e4) {
      list2.push(...right);
    } else {
      while (chunkStart < right.length) {
        list2.push(...right.slice(chunkStart, chunkStart + 1e4));
        chunkStart += 1e4;
      }
    }
  }

  // node_modules/micromark-util-subtokenize/index.js
  function subtokenize(eventsArray) {
    const jumps = {};
    let index = -1;
    let event;
    let lineIndex;
    let otherIndex;
    let otherEvent;
    let parameters;
    let subevents;
    let more;
    const events = new SpliceBuffer(eventsArray);
    while (++index < events.length) {
      while (index in jumps) {
        index = jumps[index];
      }
      event = events.get(index);
      if (index && event[1].type === "chunkFlow" && events.get(index - 1)[1].type === "listItemPrefix") {
        subevents = event[1]._tokenizer.events;
        otherIndex = 0;
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
          otherIndex += 2;
        }
        if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
          while (++otherIndex < subevents.length) {
            if (subevents[otherIndex][1].type === "content") {
              break;
            }
            if (subevents[otherIndex][1].type === "chunkText") {
              subevents[otherIndex][1]._isInFirstContentOfListItem = true;
              otherIndex++;
            }
          }
        }
      }
      if (event[0] === "enter") {
        if (event[1].contentType) {
          Object.assign(jumps, subcontent(events, index));
          index = jumps[index];
          more = true;
        }
      } else if (event[1]._container) {
        otherIndex = index;
        lineIndex = void 0;
        while (otherIndex--) {
          otherEvent = events.get(otherIndex);
          if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
            if (otherEvent[0] === "enter") {
              if (lineIndex) {
                events.get(lineIndex)[1].type = "lineEndingBlank";
              }
              otherEvent[1].type = "lineEnding";
              lineIndex = otherIndex;
            }
          } else if (otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent") {
          } else {
            break;
          }
        }
        if (lineIndex) {
          event[1].end = {
            ...events.get(lineIndex)[1].start
          };
          parameters = events.slice(lineIndex, index);
          parameters.unshift(event);
          events.splice(lineIndex, index - lineIndex + 1, parameters);
        }
      }
    }
    splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
    return !more;
  }
  function subcontent(events, eventIndex) {
    const token = events.get(eventIndex)[1];
    const context = events.get(eventIndex)[2];
    let startPosition = eventIndex - 1;
    const startPositions = [];
    let tokenizer = token._tokenizer;
    if (!tokenizer) {
      tokenizer = context.parser[token.contentType](token.start);
      if (token._contentTypeTextTrailing) {
        tokenizer._contentTypeTextTrailing = true;
      }
    }
    const childEvents = tokenizer.events;
    const jumps = [];
    const gaps = {};
    let stream;
    let previous3;
    let index = -1;
    let current = token;
    let adjust = 0;
    let start = 0;
    const breaks = [start];
    while (current) {
      while (events.get(++startPosition)[1] !== current) {
      }
      startPositions.push(startPosition);
      if (!current._tokenizer) {
        stream = context.sliceStream(current);
        if (!current.next) {
          stream.push(null);
        }
        if (previous3) {
          tokenizer.defineSkip(current.start);
        }
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = true;
        }
        tokenizer.write(stream);
        if (current._isInFirstContentOfListItem) {
          tokenizer._gfmTasklistFirstContentOfListItem = void 0;
        }
      }
      previous3 = current;
      current = current.next;
    }
    current = token;
    while (++index < childEvents.length) {
      if (
        // Find a void token that includes a break.
        childEvents[index][0] === "exit" && childEvents[index - 1][0] === "enter" && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line
      ) {
        start = index + 1;
        breaks.push(start);
        current._tokenizer = void 0;
        current.previous = void 0;
        current = current.next;
      }
    }
    tokenizer.events = [];
    if (current) {
      current._tokenizer = void 0;
      current.previous = void 0;
    } else {
      breaks.pop();
    }
    index = breaks.length;
    while (index--) {
      const slice = childEvents.slice(breaks[index], breaks[index + 1]);
      const start2 = startPositions.pop();
      jumps.push([start2, start2 + slice.length - 1]);
      events.splice(start2, 2, slice);
    }
    jumps.reverse();
    index = -1;
    while (++index < jumps.length) {
      gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
      adjust += jumps[index][1] - jumps[index][0] - 1;
    }
    return gaps;
  }

  // node_modules/micromark-core-commonmark/lib/content.js
  var content2 = {
    resolve: resolveContent,
    tokenize: tokenizeContent
  };
  var continuationConstruct = {
    partial: true,
    tokenize: tokenizeContinuation
  };
  function resolveContent(events) {
    subtokenize(events);
    return events;
  }
  function tokenizeContent(effects, ok) {
    let previous3;
    return chunkStart;
    function chunkStart(code) {
      effects.enter("content");
      previous3 = effects.enter("chunkContent", {
        contentType: "content"
      });
      return chunkInside(code);
    }
    function chunkInside(code) {
      if (code === null) {
        return contentEnd(code);
      }
      if (markdownLineEnding(code)) {
        return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
      }
      effects.consume(code);
      return chunkInside;
    }
    function contentEnd(code) {
      effects.exit("chunkContent");
      effects.exit("content");
      return ok(code);
    }
    function contentContinue(code) {
      effects.consume(code);
      effects.exit("chunkContent");
      previous3.next = effects.enter("chunkContent", {
        contentType: "content",
        previous: previous3
      });
      previous3 = previous3.next;
      return chunkInside;
    }
  }
  function tokenizeContinuation(effects, ok, nok) {
    const self = this;
    return startLookahead;
    function startLookahead(code) {
      effects.exit("chunkContent");
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return factorySpace(effects, prefixed, "linePrefix");
    }
    function prefixed(code) {
      if (code === null || markdownLineEnding(code)) {
        return nok(code);
      }
      const tail = self.events[self.events.length - 1];
      if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
        return ok(code);
      }
      return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
    }
  }

  // node_modules/micromark-factory-destination/index.js
  function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
    const limit = max || Number.POSITIVE_INFINITY;
    let balance = 0;
    return start;
    function start(code) {
      if (code === 60) {
        effects.enter(type);
        effects.enter(literalType);
        effects.enter(literalMarkerType);
        effects.consume(code);
        effects.exit(literalMarkerType);
        return enclosedBefore;
      }
      if (code === null || code === 32 || code === 41 || asciiControl(code)) {
        return nok(code);
      }
      effects.enter(type);
      effects.enter(rawType);
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return raw(code);
    }
    function enclosedBefore(code) {
      if (code === 62) {
        effects.enter(literalMarkerType);
        effects.consume(code);
        effects.exit(literalMarkerType);
        effects.exit(literalType);
        effects.exit(type);
        return ok;
      }
      effects.enter(stringType);
      effects.enter("chunkString", {
        contentType: "string"
      });
      return enclosed(code);
    }
    function enclosed(code) {
      if (code === 62) {
        effects.exit("chunkString");
        effects.exit(stringType);
        return enclosedBefore(code);
      }
      if (code === null || code === 60 || markdownLineEnding(code)) {
        return nok(code);
      }
      effects.consume(code);
      return code === 92 ? enclosedEscape : enclosed;
    }
    function enclosedEscape(code) {
      if (code === 60 || code === 62 || code === 92) {
        effects.consume(code);
        return enclosed;
      }
      return enclosed(code);
    }
    function raw(code) {
      if (!balance && (code === null || code === 41 || markdownLineEndingOrSpace(code))) {
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok(code);
      }
      if (balance < limit && code === 40) {
        effects.consume(code);
        balance++;
        return raw;
      }
      if (code === 41) {
        effects.consume(code);
        balance--;
        return raw;
      }
      if (code === null || code === 32 || code === 40 || asciiControl(code)) {
        return nok(code);
      }
      effects.consume(code);
      return code === 92 ? rawEscape : raw;
    }
    function rawEscape(code) {
      if (code === 40 || code === 41 || code === 92) {
        effects.consume(code);
        return raw;
      }
      return raw(code);
    }
  }

  // node_modules/micromark-factory-label/index.js
  function factoryLabel(effects, ok, nok, type, markerType, stringType) {
    const self = this;
    let size = 0;
    let seen;
    return start;
    function start(code) {
      effects.enter(type);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.enter(stringType);
      return atBreak;
    }
    function atBreak(code) {
      if (size > 999 || code === null || code === 91 || code === 93 && !seen || // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      code === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs) {
        return nok(code);
      }
      if (code === 93) {
        effects.exit(stringType);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        effects.exit(type);
        return ok;
      }
      if (markdownLineEnding(code)) {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        return atBreak;
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return labelInside(code);
    }
    function labelInside(code) {
      if (code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999) {
        effects.exit("chunkString");
        return atBreak(code);
      }
      effects.consume(code);
      if (!seen) seen = !markdownSpace(code);
      return code === 92 ? labelEscape : labelInside;
    }
    function labelEscape(code) {
      if (code === 91 || code === 92 || code === 93) {
        effects.consume(code);
        size++;
        return labelInside;
      }
      return labelInside(code);
    }
  }

  // node_modules/micromark-factory-title/index.js
  function factoryTitle(effects, ok, nok, type, markerType, stringType) {
    let marker;
    return start;
    function start(code) {
      if (code === 34 || code === 39 || code === 40) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        marker = code === 40 ? 41 : code;
        return begin;
      }
      return nok(code);
    }
    function begin(code) {
      if (code === marker) {
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        effects.exit(type);
        return ok;
      }
      effects.enter(stringType);
      return atBreak(code);
    }
    function atBreak(code) {
      if (code === marker) {
        effects.exit(stringType);
        return begin(marker);
      }
      if (code === null) {
        return nok(code);
      }
      if (markdownLineEnding(code)) {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        return factorySpace(effects, atBreak, "linePrefix");
      }
      effects.enter("chunkString", {
        contentType: "string"
      });
      return inside(code);
    }
    function inside(code) {
      if (code === marker || code === null || markdownLineEnding(code)) {
        effects.exit("chunkString");
        return atBreak(code);
      }
      effects.consume(code);
      return code === 92 ? escape2 : inside;
    }
    function escape2(code) {
      if (code === marker || code === 92) {
        effects.consume(code);
        return inside;
      }
      return inside(code);
    }
  }

  // node_modules/micromark-factory-whitespace/index.js
  function factoryWhitespace(effects, ok) {
    let seen;
    return start;
    function start(code) {
      if (markdownLineEnding(code)) {
        effects.enter("lineEnding");
        effects.consume(code);
        effects.exit("lineEnding");
        seen = true;
        return start;
      }
      if (markdownSpace(code)) {
        return factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code);
      }
      return ok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/definition.js
  var definition = {
    name: "definition",
    tokenize: tokenizeDefinition
  };
  var titleBefore = {
    partial: true,
    tokenize: tokenizeTitleBefore
  };
  function tokenizeDefinition(effects, ok, nok) {
    const self = this;
    let identifier;
    return start;
    function start(code) {
      effects.enter("definition");
      return before(code);
    }
    function before(code) {
      return factoryLabel.call(
        self,
        effects,
        labelAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionLabel",
        "definitionLabelMarker",
        "definitionLabelString"
      )(code);
    }
    function labelAfter(code) {
      identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
      if (code === 58) {
        effects.enter("definitionMarker");
        effects.consume(code);
        effects.exit("definitionMarker");
        return markerAfter;
      }
      return nok(code);
    }
    function markerAfter(code) {
      return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, destinationBefore)(code) : destinationBefore(code);
    }
    function destinationBefore(code) {
      return factoryDestination(
        effects,
        destinationAfter,
        // Note: we don’t need to reset the way `markdown-rs` does.
        nok,
        "definitionDestination",
        "definitionDestinationLiteral",
        "definitionDestinationLiteralMarker",
        "definitionDestinationRaw",
        "definitionDestinationString"
      )(code);
    }
    function destinationAfter(code) {
      return effects.attempt(titleBefore, after, after)(code);
    }
    function after(code) {
      return markdownSpace(code) ? factorySpace(effects, afterWhitespace, "whitespace")(code) : afterWhitespace(code);
    }
    function afterWhitespace(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("definition");
        self.parser.defined.push(identifier);
        return ok(code);
      }
      return nok(code);
    }
  }
  function tokenizeTitleBefore(effects, ok, nok) {
    return titleBefore2;
    function titleBefore2(code) {
      return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, beforeMarker)(code) : nok(code);
    }
    function beforeMarker(code) {
      return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code);
    }
    function titleAfter(code) {
      return markdownSpace(code) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code) : titleAfterOptionalWhitespace(code);
    }
    function titleAfterOptionalWhitespace(code) {
      return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/hard-break-escape.js
  var hardBreakEscape = {
    name: "hardBreakEscape",
    tokenize: tokenizeHardBreakEscape
  };
  function tokenizeHardBreakEscape(effects, ok, nok) {
    return start;
    function start(code) {
      effects.enter("hardBreakEscape");
      effects.consume(code);
      return after;
    }
    function after(code) {
      if (markdownLineEnding(code)) {
        effects.exit("hardBreakEscape");
        return ok(code);
      }
      return nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/heading-atx.js
  var headingAtx = {
    name: "headingAtx",
    resolve: resolveHeadingAtx,
    tokenize: tokenizeHeadingAtx
  };
  function resolveHeadingAtx(events, context) {
    let contentEnd = events.length - 2;
    let contentStart = 3;
    if (events[contentStart][1].type === "whitespace") {
      contentStart += 2;
    }
    if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
      contentEnd -= 2;
    }
    if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
      contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
    }
    if (contentEnd > contentStart) {
      const content3 = {
        type: "atxHeadingText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end
      };
      const text4 = {
        type: "chunkText",
        start: events[contentStart][1].start,
        end: events[contentEnd][1].end,
        contentType: "text"
      };
      splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content3, context], ["enter", text4, context], ["exit", text4, context], ["exit", content3, context]]);
    }
    return events;
  }
  function tokenizeHeadingAtx(effects, ok, nok) {
    let size = 0;
    return start;
    function start(code) {
      effects.enter("atxHeading");
      return before(code);
    }
    function before(code) {
      effects.enter("atxHeadingSequence");
      return sequenceOpen(code);
    }
    function sequenceOpen(code) {
      if (code === 35 && size++ < 6) {
        effects.consume(code);
        return sequenceOpen;
      }
      if (code === null || markdownLineEndingOrSpace(code)) {
        effects.exit("atxHeadingSequence");
        return atBreak(code);
      }
      return nok(code);
    }
    function atBreak(code) {
      if (code === 35) {
        effects.enter("atxHeadingSequence");
        return sequenceFurther(code);
      }
      if (code === null || markdownLineEnding(code)) {
        effects.exit("atxHeading");
        return ok(code);
      }
      if (markdownSpace(code)) {
        return factorySpace(effects, atBreak, "whitespace")(code);
      }
      effects.enter("atxHeadingText");
      return data(code);
    }
    function sequenceFurther(code) {
      if (code === 35) {
        effects.consume(code);
        return sequenceFurther;
      }
      effects.exit("atxHeadingSequence");
      return atBreak(code);
    }
    function data(code) {
      if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
        effects.exit("atxHeadingText");
        return atBreak(code);
      }
      effects.consume(code);
      return data;
    }
  }

  // node_modules/micromark-util-html-tag-name/index.js
  var htmlBlockNames = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  var htmlRawNames = ["pre", "script", "style", "textarea"];

  // node_modules/micromark-core-commonmark/lib/html-flow.js
  var htmlFlow = {
    concrete: true,
    name: "htmlFlow",
    resolveTo: resolveToHtmlFlow,
    tokenize: tokenizeHtmlFlow
  };
  var blankLineBefore = {
    partial: true,
    tokenize: tokenizeBlankLineBefore
  };
  function resolveToHtmlFlow(events) {
    let index = events.length;
    while (index--) {
      if (events[index][0] === "enter" && events[index][1].type === "htmlFlow") {
        break;
      }
    }
    if (index > 1 && events[index - 2][1].type === "linePrefix") {
      events[index][1].start = events[index - 2][1].start;
      events[index + 1][1].start = events[index - 2][1].start;
      events.splice(index - 2, 2);
    }
    return events;
  }
  function tokenizeHtmlFlow(effects, ok, nok) {
    const self = this;
    let marker;
    let closingTag;
    let buffer;
    let index;
    let markerB;
    return start;
    function start(code) {
      return before(code);
    }
    function before(code) {
      effects.enter("htmlFlow");
      effects.enter("htmlFlowData");
      effects.consume(code);
      return open2;
    }
    function open2(code) {
      if (code === 33) {
        effects.consume(code);
        return declarationOpen;
      }
      if (code === 47) {
        effects.consume(code);
        closingTag = true;
        return tagCloseStart;
      }
      if (code === 63) {
        effects.consume(code);
        marker = 3;
        return self.interrupt ? ok : continuationDeclarationInside;
      }
      if (asciiAlpha(code)) {
        effects.consume(code);
        buffer = String.fromCharCode(code);
        return tagName;
      }
      return nok(code);
    }
    function declarationOpen(code) {
      if (code === 45) {
        effects.consume(code);
        marker = 2;
        return commentOpenInside;
      }
      if (code === 91) {
        effects.consume(code);
        marker = 5;
        index = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code)) {
        effects.consume(code);
        marker = 4;
        return self.interrupt ? ok : continuationDeclarationInside;
      }
      return nok(code);
    }
    function commentOpenInside(code) {
      if (code === 45) {
        effects.consume(code);
        return self.interrupt ? ok : continuationDeclarationInside;
      }
      return nok(code);
    }
    function cdataOpenInside(code) {
      const value = "CDATA[";
      if (code === value.charCodeAt(index++)) {
        effects.consume(code);
        if (index === value.length) {
          return self.interrupt ? ok : continuation;
        }
        return cdataOpenInside;
      }
      return nok(code);
    }
    function tagCloseStart(code) {
      if (asciiAlpha(code)) {
        effects.consume(code);
        buffer = String.fromCharCode(code);
        return tagName;
      }
      return nok(code);
    }
    function tagName(code) {
      if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
        const slash = code === 47;
        const name = buffer.toLowerCase();
        if (!slash && !closingTag && htmlRawNames.includes(name)) {
          marker = 1;
          return self.interrupt ? ok(code) : continuation(code);
        }
        if (htmlBlockNames.includes(buffer.toLowerCase())) {
          marker = 6;
          if (slash) {
            effects.consume(code);
            return basicSelfClosing;
          }
          return self.interrupt ? ok(code) : continuation(code);
        }
        marker = 7;
        return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code) : closingTag ? completeClosingTagAfter(code) : completeAttributeNameBefore(code);
      }
      if (code === 45 || asciiAlphanumeric(code)) {
        effects.consume(code);
        buffer += String.fromCharCode(code);
        return tagName;
      }
      return nok(code);
    }
    function basicSelfClosing(code) {
      if (code === 62) {
        effects.consume(code);
        return self.interrupt ? ok : continuation;
      }
      return nok(code);
    }
    function completeClosingTagAfter(code) {
      if (markdownSpace(code)) {
        effects.consume(code);
        return completeClosingTagAfter;
      }
      return completeEnd(code);
    }
    function completeAttributeNameBefore(code) {
      if (code === 47) {
        effects.consume(code);
        return completeEnd;
      }
      if (code === 58 || code === 95 || asciiAlpha(code)) {
        effects.consume(code);
        return completeAttributeName;
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return completeAttributeNameBefore;
      }
      return completeEnd(code);
    }
    function completeAttributeName(code) {
      if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
        effects.consume(code);
        return completeAttributeName;
      }
      return completeAttributeNameAfter(code);
    }
    function completeAttributeNameAfter(code) {
      if (code === 61) {
        effects.consume(code);
        return completeAttributeValueBefore;
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return completeAttributeNameAfter;
      }
      return completeAttributeNameBefore(code);
    }
    function completeAttributeValueBefore(code) {
      if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
        return nok(code);
      }
      if (code === 34 || code === 39) {
        effects.consume(code);
        markerB = code;
        return completeAttributeValueQuoted;
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return completeAttributeValueBefore;
      }
      return completeAttributeValueUnquoted(code);
    }
    function completeAttributeValueQuoted(code) {
      if (code === markerB) {
        effects.consume(code);
        markerB = null;
        return completeAttributeValueQuotedAfter;
      }
      if (code === null || markdownLineEnding(code)) {
        return nok(code);
      }
      effects.consume(code);
      return completeAttributeValueQuoted;
    }
    function completeAttributeValueUnquoted(code) {
      if (code === null || code === 34 || code === 39 || code === 47 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code)) {
        return completeAttributeNameAfter(code);
      }
      effects.consume(code);
      return completeAttributeValueUnquoted;
    }
    function completeAttributeValueQuotedAfter(code) {
      if (code === 47 || code === 62 || markdownSpace(code)) {
        return completeAttributeNameBefore(code);
      }
      return nok(code);
    }
    function completeEnd(code) {
      if (code === 62) {
        effects.consume(code);
        return completeAfter;
      }
      return nok(code);
    }
    function completeAfter(code) {
      if (code === null || markdownLineEnding(code)) {
        return continuation(code);
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return completeAfter;
      }
      return nok(code);
    }
    function continuation(code) {
      if (code === 45 && marker === 2) {
        effects.consume(code);
        return continuationCommentInside;
      }
      if (code === 60 && marker === 1) {
        effects.consume(code);
        return continuationRawTagOpen;
      }
      if (code === 62 && marker === 4) {
        effects.consume(code);
        return continuationClose;
      }
      if (code === 63 && marker === 3) {
        effects.consume(code);
        return continuationDeclarationInside;
      }
      if (code === 93 && marker === 5) {
        effects.consume(code);
        return continuationCdataInside;
      }
      if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
        effects.exit("htmlFlowData");
        return effects.check(blankLineBefore, continuationAfter, continuationStart)(code);
      }
      if (code === null || markdownLineEnding(code)) {
        effects.exit("htmlFlowData");
        return continuationStart(code);
      }
      effects.consume(code);
      return continuation;
    }
    function continuationStart(code) {
      return effects.check(nonLazyContinuation, continuationStartNonLazy, continuationAfter)(code);
    }
    function continuationStartNonLazy(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return continuationBefore;
    }
    function continuationBefore(code) {
      if (code === null || markdownLineEnding(code)) {
        return continuationStart(code);
      }
      effects.enter("htmlFlowData");
      return continuation(code);
    }
    function continuationCommentInside(code) {
      if (code === 45) {
        effects.consume(code);
        return continuationDeclarationInside;
      }
      return continuation(code);
    }
    function continuationRawTagOpen(code) {
      if (code === 47) {
        effects.consume(code);
        buffer = "";
        return continuationRawEndTag;
      }
      return continuation(code);
    }
    function continuationRawEndTag(code) {
      if (code === 62) {
        const name = buffer.toLowerCase();
        if (htmlRawNames.includes(name)) {
          effects.consume(code);
          return continuationClose;
        }
        return continuation(code);
      }
      if (asciiAlpha(code) && buffer.length < 8) {
        effects.consume(code);
        buffer += String.fromCharCode(code);
        return continuationRawEndTag;
      }
      return continuation(code);
    }
    function continuationCdataInside(code) {
      if (code === 93) {
        effects.consume(code);
        return continuationDeclarationInside;
      }
      return continuation(code);
    }
    function continuationDeclarationInside(code) {
      if (code === 62) {
        effects.consume(code);
        return continuationClose;
      }
      if (code === 45 && marker === 2) {
        effects.consume(code);
        return continuationDeclarationInside;
      }
      return continuation(code);
    }
    function continuationClose(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("htmlFlowData");
        return continuationAfter(code);
      }
      effects.consume(code);
      return continuationClose;
    }
    function continuationAfter(code) {
      effects.exit("htmlFlow");
      return ok(code);
    }
  }
  function tokenizeBlankLineBefore(effects, ok, nok) {
    return start;
    function start(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return effects.attempt(blankLine, ok, nok);
    }
  }

  // node_modules/micromark-core-commonmark/lib/html-text.js
  var htmlText = {
    name: "htmlText",
    tokenize: tokenizeHtmlText
  };
  function tokenizeHtmlText(effects, ok, nok) {
    const self = this;
    let marker;
    let index;
    let returnState;
    return start;
    function start(code) {
      effects.enter("htmlText");
      effects.enter("htmlTextData");
      effects.consume(code);
      return open2;
    }
    function open2(code) {
      if (code === 33) {
        effects.consume(code);
        return declarationOpen;
      }
      if (code === 47) {
        effects.consume(code);
        return tagCloseStart;
      }
      if (code === 63) {
        effects.consume(code);
        return instruction;
      }
      if (asciiAlpha(code)) {
        effects.consume(code);
        return tagOpen;
      }
      return nok(code);
    }
    function declarationOpen(code) {
      if (code === 45) {
        effects.consume(code);
        return commentOpenInside;
      }
      if (code === 91) {
        effects.consume(code);
        index = 0;
        return cdataOpenInside;
      }
      if (asciiAlpha(code)) {
        effects.consume(code);
        return declaration;
      }
      return nok(code);
    }
    function commentOpenInside(code) {
      if (code === 45) {
        effects.consume(code);
        return commentEnd;
      }
      return nok(code);
    }
    function comment(code) {
      if (code === null) {
        return nok(code);
      }
      if (code === 45) {
        effects.consume(code);
        return commentClose;
      }
      if (markdownLineEnding(code)) {
        returnState = comment;
        return lineEndingBefore(code);
      }
      effects.consume(code);
      return comment;
    }
    function commentClose(code) {
      if (code === 45) {
        effects.consume(code);
        return commentEnd;
      }
      return comment(code);
    }
    function commentEnd(code) {
      return code === 62 ? end(code) : code === 45 ? commentClose(code) : comment(code);
    }
    function cdataOpenInside(code) {
      const value = "CDATA[";
      if (code === value.charCodeAt(index++)) {
        effects.consume(code);
        return index === value.length ? cdata : cdataOpenInside;
      }
      return nok(code);
    }
    function cdata(code) {
      if (code === null) {
        return nok(code);
      }
      if (code === 93) {
        effects.consume(code);
        return cdataClose;
      }
      if (markdownLineEnding(code)) {
        returnState = cdata;
        return lineEndingBefore(code);
      }
      effects.consume(code);
      return cdata;
    }
    function cdataClose(code) {
      if (code === 93) {
        effects.consume(code);
        return cdataEnd;
      }
      return cdata(code);
    }
    function cdataEnd(code) {
      if (code === 62) {
        return end(code);
      }
      if (code === 93) {
        effects.consume(code);
        return cdataEnd;
      }
      return cdata(code);
    }
    function declaration(code) {
      if (code === null || code === 62) {
        return end(code);
      }
      if (markdownLineEnding(code)) {
        returnState = declaration;
        return lineEndingBefore(code);
      }
      effects.consume(code);
      return declaration;
    }
    function instruction(code) {
      if (code === null) {
        return nok(code);
      }
      if (code === 63) {
        effects.consume(code);
        return instructionClose;
      }
      if (markdownLineEnding(code)) {
        returnState = instruction;
        return lineEndingBefore(code);
      }
      effects.consume(code);
      return instruction;
    }
    function instructionClose(code) {
      return code === 62 ? end(code) : instruction(code);
    }
    function tagCloseStart(code) {
      if (asciiAlpha(code)) {
        effects.consume(code);
        return tagClose;
      }
      return nok(code);
    }
    function tagClose(code) {
      if (code === 45 || asciiAlphanumeric(code)) {
        effects.consume(code);
        return tagClose;
      }
      return tagCloseBetween(code);
    }
    function tagCloseBetween(code) {
      if (markdownLineEnding(code)) {
        returnState = tagCloseBetween;
        return lineEndingBefore(code);
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return tagCloseBetween;
      }
      return end(code);
    }
    function tagOpen(code) {
      if (code === 45 || asciiAlphanumeric(code)) {
        effects.consume(code);
        return tagOpen;
      }
      if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
        return tagOpenBetween(code);
      }
      return nok(code);
    }
    function tagOpenBetween(code) {
      if (code === 47) {
        effects.consume(code);
        return end;
      }
      if (code === 58 || code === 95 || asciiAlpha(code)) {
        effects.consume(code);
        return tagOpenAttributeName;
      }
      if (markdownLineEnding(code)) {
        returnState = tagOpenBetween;
        return lineEndingBefore(code);
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return tagOpenBetween;
      }
      return end(code);
    }
    function tagOpenAttributeName(code) {
      if (code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code)) {
        effects.consume(code);
        return tagOpenAttributeName;
      }
      return tagOpenAttributeNameAfter(code);
    }
    function tagOpenAttributeNameAfter(code) {
      if (code === 61) {
        effects.consume(code);
        return tagOpenAttributeValueBefore;
      }
      if (markdownLineEnding(code)) {
        returnState = tagOpenAttributeNameAfter;
        return lineEndingBefore(code);
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return tagOpenAttributeNameAfter;
      }
      return tagOpenBetween(code);
    }
    function tagOpenAttributeValueBefore(code) {
      if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
        return nok(code);
      }
      if (code === 34 || code === 39) {
        effects.consume(code);
        marker = code;
        return tagOpenAttributeValueQuoted;
      }
      if (markdownLineEnding(code)) {
        returnState = tagOpenAttributeValueBefore;
        return lineEndingBefore(code);
      }
      if (markdownSpace(code)) {
        effects.consume(code);
        return tagOpenAttributeValueBefore;
      }
      effects.consume(code);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuoted(code) {
      if (code === marker) {
        effects.consume(code);
        marker = void 0;
        return tagOpenAttributeValueQuotedAfter;
      }
      if (code === null) {
        return nok(code);
      }
      if (markdownLineEnding(code)) {
        returnState = tagOpenAttributeValueQuoted;
        return lineEndingBefore(code);
      }
      effects.consume(code);
      return tagOpenAttributeValueQuoted;
    }
    function tagOpenAttributeValueUnquoted(code) {
      if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) {
        return nok(code);
      }
      if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
        return tagOpenBetween(code);
      }
      effects.consume(code);
      return tagOpenAttributeValueUnquoted;
    }
    function tagOpenAttributeValueQuotedAfter(code) {
      if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
        return tagOpenBetween(code);
      }
      return nok(code);
    }
    function end(code) {
      if (code === 62) {
        effects.consume(code);
        effects.exit("htmlTextData");
        effects.exit("htmlText");
        return ok;
      }
      return nok(code);
    }
    function lineEndingBefore(code) {
      effects.exit("htmlTextData");
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return lineEndingAfter;
    }
    function lineEndingAfter(code) {
      return markdownSpace(code) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : lineEndingAfterPrefix(code);
    }
    function lineEndingAfterPrefix(code) {
      effects.enter("htmlTextData");
      return returnState(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-end.js
  var labelEnd = {
    name: "labelEnd",
    resolveAll: resolveAllLabelEnd,
    resolveTo: resolveToLabelEnd,
    tokenize: tokenizeLabelEnd
  };
  var resourceConstruct = {
    tokenize: tokenizeResource
  };
  var referenceFullConstruct = {
    tokenize: tokenizeReferenceFull
  };
  var referenceCollapsedConstruct = {
    tokenize: tokenizeReferenceCollapsed
  };
  function resolveAllLabelEnd(events) {
    let index = -1;
    const newEvents = [];
    while (++index < events.length) {
      const token = events[index][1];
      newEvents.push(events[index]);
      if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
        const offset = token.type === "labelImage" ? 4 : 2;
        token.type = "data";
        index += offset;
      }
    }
    if (events.length !== newEvents.length) {
      splice(events, 0, events.length, newEvents);
    }
    return events;
  }
  function resolveToLabelEnd(events, context) {
    let index = events.length;
    let offset = 0;
    let open2;
    let close2;
    let media;
    while (index--) {
      const token = events[index][1];
      if (open2) {
        if (token.type === "link" || token.type === "labelLink" && token._inactive) {
          break;
        }
        if (events[index][0] === "enter" && token.type === "labelLink") {
          token._inactive = true;
        }
      } else if (close2) {
        if (events[index][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
          open2 = index;
          if (token.type !== "labelLink") {
            offset = 2;
            break;
          }
        }
      } else if (token.type === "labelEnd") {
        close2 = index;
      }
    }
    const group = {
      type: events[open2][1].type === "labelLink" ? "link" : "image",
      start: {
        ...events[open2][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    const label = {
      type: "label",
      start: {
        ...events[open2][1].start
      },
      end: {
        ...events[close2][1].end
      }
    };
    const text4 = {
      type: "labelText",
      start: {
        ...events[open2 + offset + 2][1].end
      },
      end: {
        ...events[close2 - 2][1].start
      }
    };
    media = [["enter", group, context], ["enter", label, context]];
    media = push(media, events.slice(open2 + 1, open2 + offset + 3));
    media = push(media, [["enter", text4, context]]);
    media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open2 + offset + 4, close2 - 3), context));
    media = push(media, [["exit", text4, context], events[close2 - 2], events[close2 - 1], ["exit", label, context]]);
    media = push(media, events.slice(close2 + 1));
    media = push(media, [["exit", group, context]]);
    splice(events, open2, events.length, media);
    return events;
  }
  function tokenizeLabelEnd(effects, ok, nok) {
    const self = this;
    const labelStarts = self._labelStarts;
    let labelStart;
    let defined;
    if (labelStarts) {
      while (labelStarts.length > 0 && labelStarts[labelStarts.length - 1]._balanced) {
        labelStarts.pop();
      }
      labelStart = labelStarts[labelStarts.length - 1];
    }
    return start;
    function start(code) {
      if (!labelStart) {
        return nok(code);
      }
      if (labelStart._inactive) {
        return labelEndNok(code);
      }
      defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
        start: labelStart.end,
        end: self.now()
      })));
      effects.enter("labelEnd");
      effects.enter("labelMarker");
      effects.consume(code);
      effects.exit("labelMarker");
      effects.exit("labelEnd");
      return after;
    }
    function after(code) {
      if (code === 40) {
        return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code);
      }
      if (code === 91) {
        return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code);
      }
      return defined ? labelEndOk(code) : labelEndNok(code);
    }
    function referenceNotFull(code) {
      return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
    }
    function labelEndOk(code) {
      labelStarts.pop();
      return ok(code);
    }
    function labelEndNok(code) {
      labelStart._balanced = true;
      return nok(code);
    }
  }
  function tokenizeResource(effects, ok, nok) {
    return resourceStart;
    function resourceStart(code) {
      effects.enter("resource");
      effects.enter("resourceMarker");
      effects.consume(code);
      effects.exit("resourceMarker");
      return resourceBefore;
    }
    function resourceBefore(code) {
      return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceOpen)(code) : resourceOpen(code);
    }
    function resourceOpen(code) {
      if (code === 41) {
        return resourceEnd(code);
      }
      return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code);
    }
    function resourceDestinationAfter(code) {
      return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceBetween)(code) : resourceEnd(code);
    }
    function resourceDestinationMissing(code) {
      return nok(code);
    }
    function resourceBetween(code) {
      if (code === 34 || code === 39 || code === 40) {
        return factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code);
      }
      return resourceEnd(code);
    }
    function resourceTitleAfter(code) {
      return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceEnd)(code) : resourceEnd(code);
    }
    function resourceEnd(code) {
      if (code === 41) {
        effects.enter("resourceMarker");
        effects.consume(code);
        effects.exit("resourceMarker");
        effects.exit("resource");
        return ok;
      }
      return nok(code);
    }
  }
  function tokenizeReferenceFull(effects, ok, nok) {
    const self = this;
    return referenceFull;
    function referenceFull(code) {
      return factoryLabel.call(self, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code);
    }
    function referenceFullAfter(code) {
      return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok(code) : nok(code);
    }
    function referenceFullMissing(code) {
      return nok(code);
    }
  }
  function tokenizeReferenceCollapsed(effects, ok, nok) {
    return referenceCollapsedStart;
    function referenceCollapsedStart(code) {
      effects.enter("reference");
      effects.enter("referenceMarker");
      effects.consume(code);
      effects.exit("referenceMarker");
      return referenceCollapsedOpen;
    }
    function referenceCollapsedOpen(code) {
      if (code === 93) {
        effects.enter("referenceMarker");
        effects.consume(code);
        effects.exit("referenceMarker");
        effects.exit("reference");
        return ok;
      }
      return nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-image.js
  var labelStartImage = {
    name: "labelStartImage",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartImage
  };
  function tokenizeLabelStartImage(effects, ok, nok) {
    const self = this;
    let labelImage;
    return start;
    function start(code) {
      effects.enter("labelImage");
      effects.enter("labelImageMarker");
      effects.consume(code);
      effects.exit("labelImageMarker");
      return open2;
    }
    function open2(code) {
      if (code === 91) {
        effects.enter("labelMarker");
        effects.consume(code);
        effects.exit("labelMarker");
        labelImage = effects.exit("labelImage");
        return after;
      }
      return nok(code);
    }
    function after(code) {
      if (code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs) {
        return nok(code);
      }
      self._labelStarts = self._labelStarts || [];
      self._labelStarts.push(labelImage);
      return ok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/label-start-link.js
  var labelStartLink = {
    name: "labelStartLink",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartLink
  };
  function tokenizeLabelStartLink(effects, ok, nok) {
    const self = this;
    let labelLink;
    return start;
    function start(code) {
      effects.enter("labelLink");
      effects.enter("labelMarker");
      effects.consume(code);
      effects.exit("labelMarker");
      labelLink = effects.exit("labelLink");
      return after;
    }
    function after(code) {
      if (code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs) {
        return nok(code);
      }
      self._labelStarts = self._labelStarts || [];
      self._labelStarts.push(labelLink);
      return ok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/line-ending.js
  var lineEnding = {
    name: "lineEnding",
    tokenize: tokenizeLineEnding
  };
  function tokenizeLineEnding(effects, ok) {
    return start;
    function start(code) {
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return factorySpace(effects, ok, "linePrefix");
    }
  }

  // node_modules/micromark-core-commonmark/lib/thematic-break.js
  var thematicBreak = {
    name: "thematicBreak",
    tokenize: tokenizeThematicBreak
  };
  function tokenizeThematicBreak(effects, ok, nok) {
    let size = 0;
    let marker;
    return start;
    function start(code) {
      effects.enter("thematicBreak");
      return before(code);
    }
    function before(code) {
      marker = code;
      return atBreak(code);
    }
    function atBreak(code) {
      if (code === marker) {
        effects.enter("thematicBreakSequence");
        return sequence(code);
      }
      if (size >= 3 && (code === null || markdownLineEnding(code))) {
        effects.exit("thematicBreak");
        return ok(code);
      }
      return nok(code);
    }
    function sequence(code) {
      if (code === marker) {
        effects.consume(code);
        size++;
        return sequence;
      }
      effects.exit("thematicBreakSequence");
      return markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : atBreak(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/list.js
  var list = {
    continuation: {
      tokenize: tokenizeListContinuation
    },
    exit: tokenizeListEnd,
    name: "list",
    tokenize: tokenizeListStart
  };
  var listItemPrefixWhitespaceConstruct = {
    partial: true,
    tokenize: tokenizeListItemPrefixWhitespace
  };
  var indentConstruct = {
    partial: true,
    tokenize: tokenizeIndent
  };
  function tokenizeListStart(effects, ok, nok) {
    const self = this;
    const tail = self.events[self.events.length - 1];
    let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let size = 0;
    return start;
    function start(code) {
      const kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
      if (kind === "listUnordered" ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
        if (!self.containerState.type) {
          self.containerState.type = kind;
          effects.enter(kind, {
            _container: true
          });
        }
        if (kind === "listUnordered") {
          effects.enter("listItemPrefix");
          return code === 42 || code === 45 ? effects.check(thematicBreak, nok, atMarker)(code) : atMarker(code);
        }
        if (!self.interrupt || code === 49) {
          effects.enter("listItemPrefix");
          effects.enter("listItemValue");
          return inside(code);
        }
      }
      return nok(code);
    }
    function inside(code) {
      if (asciiDigit(code) && ++size < 10) {
        effects.consume(code);
        return inside;
      }
      if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
        effects.exit("listItemValue");
        return atMarker(code);
      }
      return nok(code);
    }
    function atMarker(code) {
      effects.enter("listItemMarker");
      effects.consume(code);
      effects.exit("listItemMarker");
      self.containerState.marker = self.containerState.marker || code;
      return effects.check(
        blankLine,
        // Can’t be empty when interrupting.
        self.interrupt ? nok : onBlank,
        effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
      );
    }
    function onBlank(code) {
      self.containerState.initialBlankLine = true;
      initialSize++;
      return endOfPrefix(code);
    }
    function otherPrefix(code) {
      if (markdownSpace(code)) {
        effects.enter("listItemPrefixWhitespace");
        effects.consume(code);
        effects.exit("listItemPrefixWhitespace");
        return endOfPrefix;
      }
      return nok(code);
    }
    function endOfPrefix(code) {
      self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
      return ok(code);
    }
  }
  function tokenizeListContinuation(effects, ok, nok) {
    const self = this;
    self.containerState._closeFlow = void 0;
    return effects.check(blankLine, onBlank, notBlank);
    function onBlank(code) {
      self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
      return factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
    }
    function notBlank(code) {
      if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
        self.containerState.furtherBlankLines = void 0;
        self.containerState.initialBlankLine = void 0;
        return notInCurrentItem(code);
      }
      self.containerState.furtherBlankLines = void 0;
      self.containerState.initialBlankLine = void 0;
      return effects.attempt(indentConstruct, ok, notInCurrentItem)(code);
    }
    function notInCurrentItem(code) {
      self.containerState._closeFlow = true;
      self.interrupt = void 0;
      return factorySpace(effects, effects.attempt(list, ok, nok), "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
    }
  }
  function tokenizeIndent(effects, ok, nok) {
    const self = this;
    return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
    function afterPrefix(code) {
      const tail = self.events[self.events.length - 1];
      return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok(code) : nok(code);
    }
  }
  function tokenizeListEnd(effects) {
    effects.exit(this.containerState.type);
  }
  function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
    const self = this;
    return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
    function afterPrefix(code) {
      const tail = self.events[self.events.length - 1];
      return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok(code) : nok(code);
    }
  }

  // node_modules/micromark-core-commonmark/lib/setext-underline.js
  var setextUnderline = {
    name: "setextUnderline",
    resolveTo: resolveToSetextUnderline,
    tokenize: tokenizeSetextUnderline
  };
  function resolveToSetextUnderline(events, context) {
    const editMap = new EditMap();
    let index = events.length;
    let content3;
    let text4;
    let definition2;
    while (index--) {
      if (events[index][0] === "enter") {
        if (events[index][1].type === "content") {
          content3 = index;
          break;
        }
        if (events[index][1].type === "paragraph") {
          text4 = index;
        }
      } else {
        if (events[index][1].type === "content") {
          editMap.add(index, 1, []);
        }
        if (!definition2 && events[index][1].type === "definition") {
          definition2 = index;
        }
      }
    }
    const heading = {
      type: "setextHeading",
      start: {
        ...events[content3][1].start
      },
      end: {
        ...events[events.length - 1][1].end
      }
    };
    events[text4][1].type = "setextHeadingText";
    if (definition2) {
      editMap.add(text4, 0, [["enter", heading, context]]);
      editMap.add(definition2 + 1, 0, [["exit", events[content3][1], context]]);
      events[content3][1].end = {
        ...events[definition2][1].end
      };
    } else {
      events[content3][1] = heading;
    }
    editMap.add(events.length, 0, [["exit", heading, context]]);
    editMap.consume(events);
    return events;
  }
  function tokenizeSetextUnderline(effects, ok, nok) {
    const self = this;
    let marker;
    return start;
    function start(code) {
      let index = self.events.length;
      let paragraph;
      while (index--) {
        if (self.events[index][1].type !== "lineEnding" && self.events[index][1].type !== "linePrefix" && self.events[index][1].type !== "content") {
          paragraph = self.events[index][1].type === "paragraph";
          break;
        }
      }
      if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
        effects.enter("setextHeadingLine");
        marker = code;
        return before(code);
      }
      return nok(code);
    }
    function before(code) {
      effects.enter("setextHeadingLineSequence");
      return inside(code);
    }
    function inside(code) {
      if (code === marker) {
        effects.consume(code);
        return inside;
      }
      effects.exit("setextHeadingLineSequence");
      return markdownSpace(code) ? factorySpace(effects, after, "lineSuffix")(code) : after(code);
    }
    function after(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("setextHeadingLine");
        return ok(code);
      }
      return nok(code);
    }
  }

  // node_modules/micromark/lib/initialize/flow.js
  var flow = {
    tokenize: initializeFlow
  };
  function initializeFlow(effects) {
    const self = this;
    const initial = effects.attempt(
      // Try to parse a blank line.
      blankLine,
      atBlankEnding,
      // Try to parse initial flow (essentially, only code).
      effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), "linePrefix"))
    );
    return initial;
    function atBlankEnding(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter("lineEndingBlank");
      effects.consume(code);
      effects.exit("lineEndingBlank");
      self.currentConstruct = void 0;
      return initial;
    }
    function afterConstruct(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      self.currentConstruct = void 0;
      return initial;
    }
  }

  // node_modules/micromark/lib/initialize/text.js
  var resolver = {
    resolveAll: createResolver()
  };
  var string = initializeFactory("string");
  var text = initializeFactory("text");
  function initializeFactory(field) {
    return {
      resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
      tokenize: initializeText
    };
    function initializeText(effects) {
      const self = this;
      const constructs2 = this.parser.constructs[field];
      const text4 = effects.attempt(constructs2, start, notText);
      return start;
      function start(code) {
        return atBreak(code) ? text4(code) : notText(code);
      }
      function notText(code) {
        if (code === null) {
          effects.consume(code);
          return;
        }
        effects.enter("data");
        effects.consume(code);
        return data;
      }
      function data(code) {
        if (atBreak(code)) {
          effects.exit("data");
          return text4(code);
        }
        effects.consume(code);
        return data;
      }
      function atBreak(code) {
        if (code === null) {
          return true;
        }
        const list2 = constructs2[code];
        let index = -1;
        if (list2) {
          while (++index < list2.length) {
            const item = list2[index];
            if (!item.previous || item.previous.call(self, self.previous)) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
  function createResolver(extraResolver) {
    return resolveAllText;
    function resolveAllText(events, context) {
      let index = -1;
      let enter;
      while (++index <= events.length) {
        if (enter === void 0) {
          if (events[index] && events[index][1].type === "data") {
            enter = index;
            index++;
          }
        } else if (!events[index] || events[index][1].type !== "data") {
          if (index !== enter + 2) {
            events[enter][1].end = events[index - 1][1].end;
            events.splice(enter + 2, index - enter - 2);
            index = enter + 2;
          }
          enter = void 0;
        }
      }
      return extraResolver ? extraResolver(events, context) : events;
    }
  }
  function resolveAllLineSuffixes(events, context) {
    const editMap = new EditMap();
    let eventIndex = 0;
    while (++eventIndex <= events.length) {
      if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
        const data = events[eventIndex - 1][1];
        const chunks = context.sliceStream(data);
        let index = chunks.length;
        let bufferIndex = -1;
        let size = 0;
        let tabs;
        while (index--) {
          const chunk = chunks[index];
          if (typeof chunk === "string") {
            bufferIndex = chunk.length;
            while (chunk.charCodeAt(bufferIndex - 1) === 32) {
              size++;
              bufferIndex--;
            }
            if (bufferIndex) {
              break;
            }
            bufferIndex = -1;
          } else if (chunk === -2) {
            tabs = true;
            size++;
          } else if (chunk === -1) {
          } else {
            index++;
            break;
          }
        }
        if (context._contentTypeTextTrailing && eventIndex === events.length) {
          size = 0;
        }
        if (size) {
          const token = {
            type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              _bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex,
              _index: data.start._index + index,
              line: data.end.line,
              column: data.end.column - size,
              offset: data.end.offset - size
            },
            end: {
              ...data.end
            }
          };
          data.end = {
            ...token.start
          };
          if (data.start.offset === data.end.offset) {
            Object.assign(data, token);
          } else {
            editMap.add(eventIndex, 0, [["enter", token, context], ["exit", token, context]]);
          }
        }
        eventIndex++;
      }
    }
    editMap.consume(events);
    return events;
  }

  // node_modules/micromark/lib/constructs.js
  var constructs_exports = {};
  __export(constructs_exports, {
    attentionMarkers: () => attentionMarkers,
    contentInitial: () => contentInitial,
    disable: () => disable,
    document: () => document3,
    flow: () => flow2,
    flowInitial: () => flowInitial,
    insideSpan: () => insideSpan,
    string: () => string2,
    text: () => text2
  });
  var document3 = {
    [42]: list,
    [43]: list,
    [45]: list,
    [48]: list,
    [49]: list,
    [50]: list,
    [51]: list,
    [52]: list,
    [53]: list,
    [54]: list,
    [55]: list,
    [56]: list,
    [57]: list,
    [62]: blockQuote
  };
  var contentInitial = {
    [91]: definition
  };
  var flowInitial = {
    [-2]: codeIndented,
    [-1]: codeIndented,
    [32]: codeIndented
  };
  var flow2 = {
    [35]: headingAtx,
    [42]: thematicBreak,
    [45]: [setextUnderline, thematicBreak],
    [60]: htmlFlow,
    [61]: setextUnderline,
    [95]: thematicBreak,
    [96]: codeFenced,
    [126]: codeFenced
  };
  var string2 = {
    [38]: characterReference,
    [92]: characterEscape
  };
  var text2 = {
    [-5]: lineEnding,
    [-4]: lineEnding,
    [-3]: lineEnding,
    [33]: labelStartImage,
    [38]: characterReference,
    [42]: attention,
    [60]: [autolink, htmlText],
    [91]: labelStartLink,
    [92]: [hardBreakEscape, characterEscape],
    [93]: labelEnd,
    [95]: attention,
    [96]: codeText
  };
  var insideSpan = {
    null: [attention, resolver]
  };
  var attentionMarkers = {
    null: [42, 95]
  };
  var disable = {
    null: []
  };

  // node_modules/micromark/lib/create-tokenizer.js
  function createTokenizer(parser, initialize, from) {
    let point = {
      _bufferIndex: -1,
      _index: 0,
      line: from && from.line || 1,
      column: from && from.column || 1,
      offset: from && from.offset || 0
    };
    const columnStart = {};
    const resolveAllConstructs = [];
    let chunks = [];
    let stack = [];
    let consumed = true;
    const effects = {
      attempt: constructFactory(onsuccessfulconstruct),
      check: constructFactory(onsuccessfulcheck),
      consume,
      enter,
      exit: exit2,
      interrupt: constructFactory(onsuccessfulcheck, {
        interrupt: true
      })
    };
    const context = {
      code: null,
      containerState: {},
      defineSkip,
      events: [],
      now,
      parser,
      previous: null,
      sliceSerialize,
      sliceStream,
      write
    };
    let state = initialize.tokenize.call(context, effects);
    let expectedCode;
    if (initialize.resolveAll) {
      resolveAllConstructs.push(initialize);
    }
    return context;
    function write(slice) {
      chunks = push(chunks, slice);
      main2();
      if (chunks[chunks.length - 1] !== null) {
        return [];
      }
      addResult(initialize, 0);
      context.events = resolveAll(resolveAllConstructs, context.events, context);
      return context.events;
    }
    function sliceSerialize(token, expandTabs) {
      return serializeChunks(sliceStream(token), expandTabs);
    }
    function sliceStream(token) {
      return sliceChunks(chunks, token);
    }
    function now() {
      const {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      } = point;
      return {
        _bufferIndex,
        _index,
        line,
        column,
        offset
      };
    }
    function defineSkip(value) {
      columnStart[value.line] = value.column;
      accountForPotentialSkip();
    }
    function main2() {
      while (point._index < chunks.length) {
        const chunk = chunks[point._index];
        if (typeof chunk === "string") {
          const chunkIndex = point._index;
          if (point._bufferIndex < 0) {
            point._bufferIndex = 0;
          }
          while (point._index === chunkIndex && point._bufferIndex < chunk.length) {
            go(chunk.charCodeAt(point._bufferIndex));
          }
        } else {
          go(chunk);
        }
      }
    }
    function go(code) {
      consumed = void 0;
      expectedCode = code;
      state = state(code);
    }
    function consume(code) {
      if (markdownLineEnding(code)) {
        point.line++;
        point.column = 1;
        point.offset += code === -3 ? 2 : 1;
        accountForPotentialSkip();
      } else if (code !== -1) {
        point.column++;
        point.offset++;
      }
      if (point._bufferIndex < 0) {
        point._index++;
      } else {
        point._bufferIndex++;
        if (point._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
        // strings.
        /** @type {string} */
        chunks[point._index].length) {
          point._bufferIndex = -1;
          point._index++;
        }
      }
      context.previous = code;
      consumed = true;
    }
    function enter(type, fields) {
      const token = fields || {};
      token.type = type;
      token.start = now();
      context.events.push(["enter", token, context]);
      stack.push(token);
      return token;
    }
    function exit2(type) {
      const token = stack.pop();
      token.end = now();
      context.events.push(["exit", token, context]);
      return token;
    }
    function onsuccessfulconstruct(construct, info) {
      addResult(construct, info.from);
    }
    function onsuccessfulcheck(_3, info) {
      info.restore();
    }
    function constructFactory(onreturn, fields) {
      return hook;
      function hook(constructs2, returnState, bogusState) {
        let listOfConstructs;
        let constructIndex;
        let currentConstruct;
        let info;
        return Array.isArray(constructs2) ? (
          /* c8 ignore next 1 */
          handleListOfConstructs(constructs2)
        ) : "tokenize" in constructs2 ? (
          // Looks like a construct.
          handleListOfConstructs([
            /** @type {Construct} */
            constructs2
          ])
        ) : handleMapOfConstructs(constructs2);
        function handleMapOfConstructs(map) {
          return start;
          function start(code) {
            const left = code !== null && map[code];
            const all = code !== null && map.null;
            const list2 = [
              // To do: add more extension tests.
              /* c8 ignore next 2 */
              ...Array.isArray(left) ? left : left ? [left] : [],
              ...Array.isArray(all) ? all : all ? [all] : []
            ];
            return handleListOfConstructs(list2)(code);
          }
        }
        function handleListOfConstructs(list2) {
          listOfConstructs = list2;
          constructIndex = 0;
          if (list2.length === 0) {
            return bogusState;
          }
          return handleConstruct(list2[constructIndex]);
        }
        function handleConstruct(construct) {
          return start;
          function start(code) {
            info = store();
            currentConstruct = construct;
            if (!construct.partial) {
              context.currentConstruct = construct;
            }
            if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
              return nok(code);
            }
            return construct.tokenize.call(
              // If we do have fields, create an object w/ `context` as its
              // prototype.
              // This allows a “live binding”, which is needed for `interrupt`.
              fields ? Object.assign(Object.create(context), fields) : context,
              effects,
              ok,
              nok
            )(code);
          }
        }
        function ok(code) {
          consumed = true;
          onreturn(currentConstruct, info);
          return returnState;
        }
        function nok(code) {
          consumed = true;
          info.restore();
          if (++constructIndex < listOfConstructs.length) {
            return handleConstruct(listOfConstructs[constructIndex]);
          }
          return bogusState;
        }
      }
    }
    function addResult(construct, from2) {
      if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
        resolveAllConstructs.push(construct);
      }
      if (construct.resolve) {
        splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
      }
      if (construct.resolveTo) {
        context.events = construct.resolveTo(context.events, context);
      }
    }
    function store() {
      const startPoint = now();
      const startPrevious = context.previous;
      const startCurrentConstruct = context.currentConstruct;
      const startEventsIndex = context.events.length;
      const startStack = Array.from(stack);
      return {
        from: startEventsIndex,
        restore
      };
      function restore() {
        point = startPoint;
        context.previous = startPrevious;
        context.currentConstruct = startCurrentConstruct;
        context.events.length = startEventsIndex;
        stack = startStack;
        accountForPotentialSkip();
      }
    }
    function accountForPotentialSkip() {
      if (point.line in columnStart && point.column < 2) {
        point.column = columnStart[point.line];
        point.offset += columnStart[point.line] - 1;
      }
    }
  }
  function sliceChunks(chunks, token) {
    const startIndex = token.start._index;
    const startBufferIndex = token.start._bufferIndex;
    const endIndex = token.end._index;
    const endBufferIndex = token.end._bufferIndex;
    let view;
    if (startIndex === endIndex) {
      view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
    } else {
      view = chunks.slice(startIndex, endIndex);
      if (startBufferIndex > -1) {
        const head = view[0];
        if (typeof head === "string") {
          view[0] = head.slice(startBufferIndex);
        } else {
          view.shift();
        }
      }
      if (endBufferIndex > 0) {
        view.push(chunks[endIndex].slice(0, endBufferIndex));
      }
    }
    return view;
  }
  function serializeChunks(chunks, expandTabs) {
    let index = -1;
    const result = [];
    let atTab;
    while (++index < chunks.length) {
      const chunk = chunks[index];
      let value;
      if (typeof chunk === "string") {
        value = chunk;
      } else {
        switch (chunk) {
          case -5: {
            value = "\r";
            break;
          }
          case -4: {
            value = "\n";
            break;
          }
          case -3: {
            value = "\r\n";
            break;
          }
          case -2: {
            value = expandTabs ? " " : "	";
            break;
          }
          case -1: {
            if (!expandTabs && atTab) {
              continue;
            }
            value = " ";
            break;
          }
          default: {
            value = String.fromCharCode(chunk);
          }
        }
      }
      atTab = chunk === -2;
      result.push(value);
    }
    return result.join("");
  }

  // node_modules/micromark/lib/parse.js
  function parse(options) {
    const settings = options || {};
    const constructs2 = (
      /** @type {FullNormalizedExtension} */
      combineExtensions([constructs_exports, ...settings.extensions || []])
    );
    const parser = {
      constructs: constructs2,
      content: create(content),
      defined: [],
      document: create(document2),
      flow: create(flow),
      lazy: {},
      string: create(string),
      text: create(text)
    };
    return parser;
    function create(initial) {
      return creator;
      function creator(from) {
        return createTokenizer(parser, initial, from);
      }
    }
  }

  // node_modules/micromark/lib/postprocess.js
  function postprocess(events) {
    while (!subtokenize(events)) {
    }
    return events;
  }

  // node_modules/micromark/lib/preprocess.js
  var search = /[\0\t\n\r]/g;
  function preprocess() {
    let column = 1;
    let buffer = "";
    let start = true;
    let atCarriageReturn;
    return preprocessor;
    function preprocessor(value, encoding, end) {
      value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
      const chunks = [];
      let startPosition = 0;
      buffer = "";
      if (start) {
        if (value.charCodeAt(0) === 65279) {
          startPosition++;
        }
        start = void 0;
      }
      while (startPosition < value.length) {
        search.lastIndex = startPosition;
        const match = search.exec(value);
        const endPosition = match && match.index !== void 0 ? match.index : value.length;
        const code = value.charCodeAt(endPosition);
        if (!match) {
          buffer = value.slice(startPosition);
          break;
        }
        if (code === 10 && startPosition === endPosition && atCarriageReturn) {
          chunks.push(-3);
          atCarriageReturn = void 0;
        } else {
          if (atCarriageReturn) {
            chunks.push(-5);
            atCarriageReturn = void 0;
          }
          if (startPosition < endPosition) {
            chunks.push(value.slice(startPosition, endPosition));
            column += endPosition - startPosition;
          }
          switch (code) {
            case 0: {
              chunks.push(65533);
              column++;
              break;
            }
            case 9: {
              const next = Math.ceil(column / 4) * 4;
              chunks.push(-2);
              while (column++ < next) {
                chunks.push(-1);
              }
              break;
            }
            case 10: {
              chunks.push(-4);
              column = 1;
              break;
            }
            default: {
              atCarriageReturn = true;
              column = 1;
            }
          }
        }
        startPosition = endPosition + 1;
      }
      if (end) {
        if (atCarriageReturn) {
          chunks.push(-5);
        }
        if (buffer) {
          chunks.push(buffer);
        }
        chunks.push(null);
      }
      return chunks;
    }
  }

  // node_modules/micromark-extension-math/lib/math-flow.js
  var mathFlow = {
    tokenize: tokenizeMathFenced,
    concrete: true,
    name: "mathFlow"
  };
  var nonLazyContinuation2 = {
    tokenize: tokenizeNonLazyContinuation2,
    partial: true
  };
  function tokenizeMathFenced(effects, ok, nok) {
    const self = this;
    const tail = self.events[self.events.length - 1];
    const initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
    let sizeOpen = 0;
    return start;
    function start(code) {
      effects.enter("mathFlow");
      effects.enter("mathFlowFence");
      effects.enter("mathFlowFenceSequence");
      return sequenceOpen(code);
    }
    function sequenceOpen(code) {
      if (code === 36) {
        effects.consume(code);
        sizeOpen++;
        return sequenceOpen;
      }
      if (sizeOpen < 2) {
        return nok(code);
      }
      effects.exit("mathFlowFenceSequence");
      return factorySpace(effects, metaBefore, "whitespace")(code);
    }
    function metaBefore(code) {
      if (code === null || markdownLineEnding(code)) {
        return metaAfter(code);
      }
      effects.enter("mathFlowFenceMeta");
      effects.enter("chunkString", {
        contentType: "string"
      });
      return meta(code);
    }
    function meta(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("chunkString");
        effects.exit("mathFlowFenceMeta");
        return metaAfter(code);
      }
      if (code === 36) {
        return nok(code);
      }
      effects.consume(code);
      return meta;
    }
    function metaAfter(code) {
      effects.exit("mathFlowFence");
      if (self.interrupt) {
        return ok(code);
      }
      return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code);
    }
    function beforeNonLazyContinuation(code) {
      return effects.attempt({
        tokenize: tokenizeClosingFence,
        partial: true
      }, after, contentStart)(code);
    }
    function contentStart(code) {
      return (initialSize ? factorySpace(effects, beforeContentChunk, "linePrefix", initialSize + 1) : beforeContentChunk)(code);
    }
    function beforeContentChunk(code) {
      if (code === null) {
        return after(code);
      }
      if (markdownLineEnding(code)) {
        return effects.attempt(nonLazyContinuation2, beforeNonLazyContinuation, after)(code);
      }
      effects.enter("mathFlowValue");
      return contentChunk(code);
    }
    function contentChunk(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit("mathFlowValue");
        return beforeContentChunk(code);
      }
      effects.consume(code);
      return contentChunk;
    }
    function after(code) {
      effects.exit("mathFlow");
      return ok(code);
    }
    function tokenizeClosingFence(effects2, ok2, nok2) {
      let size = 0;
      return factorySpace(effects2, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
      function beforeSequenceClose(code) {
        effects2.enter("mathFlowFence");
        effects2.enter("mathFlowFenceSequence");
        return sequenceClose(code);
      }
      function sequenceClose(code) {
        if (code === 36) {
          size++;
          effects2.consume(code);
          return sequenceClose;
        }
        if (size < sizeOpen) {
          return nok2(code);
        }
        effects2.exit("mathFlowFenceSequence");
        return factorySpace(effects2, afterSequenceClose, "whitespace")(code);
      }
      function afterSequenceClose(code) {
        if (code === null || markdownLineEnding(code)) {
          effects2.exit("mathFlowFence");
          return ok2(code);
        }
        return nok2(code);
      }
    }
  }
  function tokenizeNonLazyContinuation2(effects, ok, nok) {
    const self = this;
    return start;
    function start(code) {
      if (code === null) {
        return ok(code);
      }
      effects.enter("lineEnding");
      effects.consume(code);
      effects.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code) {
      return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
    }
  }

  // node_modules/micromark-extension-math/lib/math-text.js
  function mathText(options) {
    const options_ = options || {};
    let single = options_.singleDollarTextMath;
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      tokenize: tokenizeMathText,
      resolve: resolveMathText,
      previous: previous2,
      name: "mathText"
    };
    function tokenizeMathText(effects, ok, nok) {
      const self = this;
      let sizeOpen = 0;
      let size;
      let token;
      return start;
      function start(code) {
        effects.enter("mathText");
        effects.enter("mathTextSequence");
        return sequenceOpen(code);
      }
      function sequenceOpen(code) {
        if (code === 36) {
          effects.consume(code);
          sizeOpen++;
          return sequenceOpen;
        }
        if (sizeOpen < 2 && !single) {
          return nok(code);
        }
        effects.exit("mathTextSequence");
        return between(code);
      }
      function between(code) {
        if (code === null) {
          return nok(code);
        }
        if (code === 36) {
          token = effects.enter("mathTextSequence");
          size = 0;
          return sequenceClose(code);
        }
        if (code === 32) {
          effects.enter("space");
          effects.consume(code);
          effects.exit("space");
          return between;
        }
        if (markdownLineEnding(code)) {
          effects.enter("lineEnding");
          effects.consume(code);
          effects.exit("lineEnding");
          return between;
        }
        effects.enter("mathTextData");
        return data(code);
      }
      function data(code) {
        if (code === null || code === 32 || code === 36 || markdownLineEnding(code)) {
          effects.exit("mathTextData");
          return between(code);
        }
        effects.consume(code);
        return data;
      }
      function sequenceClose(code) {
        if (code === 36) {
          effects.consume(code);
          size++;
          return sequenceClose;
        }
        if (size === sizeOpen) {
          effects.exit("mathTextSequence");
          effects.exit("mathText");
          return ok(code);
        }
        token.type = "mathTextData";
        return data(code);
      }
    }
  }
  function resolveMathText(events) {
    let tailExitIndex = events.length - 4;
    let headEnterIndex = 3;
    let index;
    let enter;
    if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
      index = headEnterIndex;
      while (++index < tailExitIndex) {
        if (events[index][1].type === "mathTextData") {
          events[tailExitIndex][1].type = "mathTextPadding";
          events[headEnterIndex][1].type = "mathTextPadding";
          headEnterIndex += 2;
          tailExitIndex -= 2;
          break;
        }
      }
    }
    index = headEnterIndex - 1;
    tailExitIndex++;
    while (++index <= tailExitIndex) {
      if (enter === void 0) {
        if (index !== tailExitIndex && events[index][1].type !== "lineEnding") {
          enter = index;
        }
      } else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
        events[enter][1].type = "mathTextData";
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          tailExitIndex -= index - enter - 2;
          index = enter + 2;
        }
        enter = void 0;
      }
    }
    return events;
  }
  function previous2(code) {
    return code !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
  }

  // node_modules/micromark-extension-math/lib/syntax.js
  function math(options) {
    return {
      flow: {
        [36]: mathFlow
      },
      text: {
        [36]: mathText(options)
      }
    };
  }

  // node_modules/katex/dist/katex.mjs
  var ParseError = class _ParseError extends Error {
    // The underlying error message without any context added.
    constructor(message, token) {
      var error = "KaTeX parse error: " + message;
      var start;
      var end;
      var loc = token && token.loc;
      if (loc && loc.start <= loc.end) {
        var input = loc.lexer.input;
        start = loc.start;
        end = loc.end;
        if (start === input.length) {
          error += " at end of input: ";
        } else {
          error += " at position " + (start + 1) + ": ";
        }
        var underlined = input.slice(start, end).replace(/[^]/g, "$&\u0332");
        var left;
        if (start > 15) {
          left = "\u2026" + input.slice(start - 15, start);
        } else {
          left = input.slice(0, start);
        }
        var right;
        if (end + 15 < input.length) {
          right = input.slice(end, end + 15) + "\u2026";
        } else {
          right = input.slice(end);
        }
        error += left + underlined + right;
      }
      super(error);
      this.name = "ParseError";
      this.position = void 0;
      this.length = void 0;
      this.rawMessage = void 0;
      Object.setPrototypeOf(this, _ParseError.prototype);
      this.position = start;
      if (start != null && end != null) {
        this.length = end - start;
      }
      this.rawMessage = message;
    }
  };
  var uppercase = /([A-Z])/g;
  var hyphenate = (str) => str.replace(uppercase, "-$1").toLowerCase();
  var ESCAPE_LOOKUP = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    '"': "&quot;",
    "'": "&#x27;"
  };
  var ESCAPE_REGEX = /[&><"']/g;
  var escape = (text4) => String(text4).replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
  var getBaseElem = (group) => {
    if (group.type === "ordgroup") {
      if (group.body.length === 1) {
        return getBaseElem(group.body[0]);
      } else {
        return group;
      }
    } else if (group.type === "color") {
      if (group.body.length === 1) {
        return getBaseElem(group.body[0]);
      } else {
        return group;
      }
    } else if (group.type === "font") {
      return getBaseElem(group.body);
    } else {
      return group;
    }
  };
  var characterNodesTypes = /* @__PURE__ */ new Set(["mathord", "textord", "atom"]);
  var isCharacterBox = (group) => characterNodesTypes.has(getBaseElem(group).type);
  var protocolFromUrl = (url) => {
    var protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(url);
    if (!protocol) {
      return "_relative";
    }
    if (protocol[2] !== ":") {
      return null;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(protocol[1])) {
      return null;
    }
    return protocol[1].toLowerCase();
  };
  var SETTINGS_SCHEMA = {
    displayMode: {
      type: "boolean",
      description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
      cli: "-d, --display-mode"
    },
    output: {
      type: {
        enum: ["htmlAndMathml", "html", "mathml"]
      },
      description: "Determines the markup language of the output.",
      cli: "-F, --format <type>"
    },
    leqno: {
      type: "boolean",
      description: "Render display math in leqno style (left-justified tags)."
    },
    fleqn: {
      type: "boolean",
      description: "Render display math flush left."
    },
    throwOnError: {
      type: "boolean",
      default: true,
      cli: "-t, --no-throw-on-error",
      cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
    },
    errorColor: {
      type: "string",
      default: "#cc0000",
      cli: "-c, --error-color <color>",
      cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
      cliProcessor: (color) => "#" + color
    },
    macros: {
      type: "object",
      cli: "-m, --macro <def>",
      cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
      cliDefault: [],
      cliProcessor: (def, defs) => {
        defs.push(def);
        return defs;
      }
    },
    minRuleThickness: {
      type: "number",
      description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
      processor: (t) => Math.max(0, t),
      cli: "--min-rule-thickness <size>",
      cliProcessor: parseFloat
    },
    colorIsTextColor: {
      type: "boolean",
      description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
      cli: "-b, --color-is-text-color"
    },
    strict: {
      type: [{
        enum: ["warn", "ignore", "error"]
      }, "boolean", "function"],
      description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
      cli: "-S, --strict",
      cliDefault: false
    },
    trust: {
      type: ["boolean", "function"],
      description: "Trust the input, enabling all HTML features such as \\url.",
      cli: "-T, --trust"
    },
    maxSize: {
      type: "number",
      default: Infinity,
      description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
      processor: (s) => Math.max(0, s),
      cli: "-s, --max-size <n>",
      cliProcessor: parseInt
    },
    maxExpand: {
      type: "number",
      default: 1e3,
      description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
      processor: (n) => Math.max(0, n),
      cli: "-e, --max-expand <n>",
      cliProcessor: (n) => n === "Infinity" ? Infinity : parseInt(n)
    },
    globalGroup: {
      type: "boolean",
      cli: false
    }
  };
  function getImplicitDefault(type) {
    if (typeof type !== "string") {
      return type.enum[0];
    }
    switch (type) {
      case "boolean":
        return false;
      case "string":
        return "";
      case "number":
        return 0;
      case "object":
        return {};
      default:
        throw new Error("Unexpected schema type; settings must declare an explicit default.");
    }
  }
  function getDefaultValue(schema) {
    if (schema.default !== void 0) {
      return schema.default;
    }
    var type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    return getImplicitDefault(type);
  }
  function applySetting(target, prop, options, schema) {
    var optionValue = options[prop];
    target[prop] = optionValue !== void 0 ? schema.processor ? schema.processor(optionValue) : optionValue : getDefaultValue(schema);
  }
  var Settings = class {
    constructor(options) {
      if (options === void 0) {
        options = {};
      }
      this.displayMode = void 0;
      this.output = void 0;
      this.leqno = void 0;
      this.fleqn = void 0;
      this.throwOnError = void 0;
      this.errorColor = void 0;
      this.macros = void 0;
      this.minRuleThickness = void 0;
      this.colorIsTextColor = void 0;
      this.strict = void 0;
      this.trust = void 0;
      this.maxSize = void 0;
      this.maxExpand = void 0;
      this.globalGroup = void 0;
      options = options || {};
      for (var prop of Object.keys(SETTINGS_SCHEMA)) {
        var schema = SETTINGS_SCHEMA[prop];
        if (schema) {
          applySetting(this, prop, options, schema);
        }
      }
    }
    /**
     * Report nonstrict (non-LaTeX-compatible) input.
     * Can safely not be called if `this.strict` is false in JavaScript.
     */
    reportNonstrict(errorCode, errorMsg, token) {
      var strict = this.strict;
      if (typeof strict === "function") {
        strict = strict(errorCode, errorMsg, token);
      }
      if (!strict || strict === "ignore") {
        return;
      } else if (strict === true || strict === "error") {
        throw new ParseError("LaTeX-incompatible input and strict mode is set to 'error': " + (errorMsg + " [" + errorCode + "]"), token);
      } else if (strict === "warn") {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
      } else {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
      }
    }
    /**
     * Check whether to apply strict (LaTeX-adhering) behavior for unusual
     * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
     * instead, "error" translates to a return value of `true`, while "ignore"
     * translates to a return value of `false`.  May still print a warning:
     * "warn" prints a warning and returns `false`.
     * This is for the second category of `errorCode`s listed in the README.
     */
    useStrictBehavior(errorCode, errorMsg, token) {
      var strict = this.strict;
      if (typeof strict === "function") {
        try {
          strict = strict(errorCode, errorMsg, token);
        } catch (error) {
          strict = "error";
        }
      }
      if (!strict || strict === "ignore") {
        return false;
      } else if (strict === true || strict === "error") {
        return true;
      } else if (strict === "warn") {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
        return false;
      } else {
        typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
        return false;
      }
    }
    /**
     * Check whether to test potentially dangerous input, and return
     * `true` (trusted) or `false` (untrusted).  The sole argument `context`
     * should be an object with `command` field specifying the relevant LaTeX
     * command (as a string starting with `\`), and any other arguments, etc.
     * If `context` has a `url` field, a `protocol` field will automatically
     * get added by this function (changing the specified object).
     */
    isTrusted(context) {
      if ("url" in context && context.url && !context.protocol) {
        var protocol = protocolFromUrl(context.url);
        if (protocol == null) {
          return false;
        }
        context.protocol = protocol;
      }
      var trust = typeof this.trust === "function" ? this.trust(context) : this.trust;
      return Boolean(trust);
    }
  };
  var Style = class {
    constructor(id, size, cramped) {
      this.id = void 0;
      this.size = void 0;
      this.cramped = void 0;
      this.id = id;
      this.size = size;
      this.cramped = cramped;
    }
    /**
     * Get the style of a superscript given a base in the current style.
     */
    sup() {
      return styles[sup[this.id]];
    }
    /**
     * Get the style of a subscript given a base in the current style.
     */
    sub() {
      return styles[sub[this.id]];
    }
    /**
     * Get the style of a fraction numerator given the fraction in the current
     * style.
     */
    fracNum() {
      return styles[fracNum[this.id]];
    }
    /**
     * Get the style of a fraction denominator given the fraction in the current
     * style.
     */
    fracDen() {
      return styles[fracDen[this.id]];
    }
    /**
     * Get the cramped version of a style (in particular, cramping a cramped style
     * doesn't change the style).
     */
    cramp() {
      return styles[cramp[this.id]];
    }
    /**
     * Get a text or display version of this style.
     */
    text() {
      return styles[text$1[this.id]];
    }
    /**
     * Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
     */
    isTight() {
      return this.size >= 2;
    }
  };
  var D = 0;
  var Dc = 1;
  var T = 2;
  var Tc = 3;
  var S = 4;
  var Sc = 5;
  var SS = 6;
  var SSc = 7;
  var styles = [new Style(D, 0, false), new Style(Dc, 0, true), new Style(T, 1, false), new Style(Tc, 1, true), new Style(S, 2, false), new Style(Sc, 2, true), new Style(SS, 3, false), new Style(SSc, 3, true)];
  var sup = [S, Sc, S, Sc, SS, SSc, SS, SSc];
  var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
  var fracNum = [T, Tc, S, Sc, SS, SSc, SS, SSc];
  var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];
  var cramp = [Dc, Dc, Tc, Tc, Sc, Sc, SSc, SSc];
  var text$1 = [D, Dc, T, Tc, T, Tc, T, Tc];
  var Style$1 = {
    DISPLAY: styles[D],
    TEXT: styles[T],
    SCRIPT: styles[S],
    SCRIPTSCRIPT: styles[SS]
  };
  var scriptData = [{
    // Latin characters beyond the Latin-1 characters we have metrics for.
    // Needed for Czech, Hungarian and Turkish text, for example.
    name: "latin",
    blocks: [
      [256, 591],
      // Latin Extended-A and Latin Extended-B
      [768, 879]
      // Combining Diacritical marks
    ]
  }, {
    // The Cyrillic script used by Russian and related languages.
    // A Cyrillic subset used to be supported as explicitly defined
    // symbols in symbols.js
    name: "cyrillic",
    blocks: [[1024, 1279]]
  }, {
    // Armenian
    name: "armenian",
    blocks: [[1328, 1423]]
  }, {
    // The Brahmic scripts of South and Southeast Asia
    // Devanagari (0900–097F)
    // Bengali (0980–09FF)
    // Gurmukhi (0A00–0A7F)
    // Gujarati (0A80–0AFF)
    // Oriya (0B00–0B7F)
    // Tamil (0B80–0BFF)
    // Telugu (0C00–0C7F)
    // Kannada (0C80–0CFF)
    // Malayalam (0D00–0D7F)
    // Sinhala (0D80–0DFF)
    // Thai (0E00–0E7F)
    // Lao (0E80–0EFF)
    // Tibetan (0F00–0FFF)
    // Myanmar (1000–109F)
    name: "brahmic",
    blocks: [[2304, 4255]]
  }, {
    name: "georgian",
    blocks: [[4256, 4351]]
  }, {
    // Chinese and Japanese.
    // The "k" in cjk is for Korean, but we've separated Korean out
    name: "cjk",
    blocks: [
      [12288, 12543],
      // CJK symbols and punctuation, Hiragana, Katakana
      [19968, 40879],
      // CJK ideograms
      [65280, 65376]
      // Fullwidth punctuation
      // TODO: add halfwidth Katakana and Romanji glyphs
    ]
  }, {
    // Korean
    name: "hangul",
    blocks: [[44032, 55215]]
  }];
  function scriptFromCodepoint(codepoint) {
    for (var i = 0; i < scriptData.length; i++) {
      var script2 = scriptData[i];
      for (var _i = 0; _i < script2.blocks.length; _i++) {
        var block = script2.blocks[_i];
        if (codepoint >= block[0] && codepoint <= block[1]) {
          return script2.name;
        }
      }
    }
    return null;
  }
  var allBlocks = [];
  scriptData.forEach((s) => s.blocks.forEach((b3) => allBlocks.push(...b3)));
  function supportedCodepoint(codepoint) {
    for (var i = 0; i < allBlocks.length; i += 2) {
      if (codepoint >= allBlocks[i] && codepoint <= allBlocks[i + 1]) {
        return true;
      }
    }
    return false;
  }
  var doubleBrushStroke = (svgPath) => svgPath + " " + svgPath;
  var hLinePad = 80;
  var sqrtMain = function sqrtMain2(extraVinculum, hLinePad2) {
    return "M95," + (622 + extraVinculum + hLinePad2) + "\nc-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14\nc0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54\nc44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10\ns173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429\nc69,-144,104.5,-217.7,106.5,-221\nl" + extraVinculum / 2.075 + " -" + extraVinculum + "\nc5.3,-9.3,12,-14,20,-14\nH400000v" + (40 + extraVinculum) + "H845.2724\ns-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7\nc-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z\nM" + (834 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize1 = function sqrtSize12(extraVinculum, hLinePad2) {
    return "M263," + (601 + extraVinculum + hLinePad2) + "c0.7,0,18,39.7,52,119\nc34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120\nc340,-704.7,510.7,-1060.3,512,-1067\nl" + extraVinculum / 2.084 + " -" + extraVinculum + "\nc4.7,-7.3,11,-11,19,-11\nH40000v" + (40 + extraVinculum) + "H1012.3\ns-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232\nc-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1\ns-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26\nc-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z\nM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize2 = function sqrtSize22(extraVinculum, hLinePad2) {
    return "M983 " + (10 + extraVinculum + hLinePad2) + "\nl" + extraVinculum / 3.13 + " -" + extraVinculum + "\nc4,-6.7,10,-10,18,-10 H400000v" + (40 + extraVinculum) + "\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize3 = function sqrtSize32(extraVinculum, hLinePad2) {
    return "M424," + (2398 + extraVinculum + hLinePad2) + "\nc-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514\nc0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20\ns-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121\ns209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081\nl" + extraVinculum / 4.223 + " -" + extraVinculum + "c4,-6.7,10,-10,18,-10 H400000\nv" + (40 + extraVinculum) + "H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185\nc-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M" + (1001 + extraVinculum) + " " + hLinePad2 + "\nh400000v" + (40 + extraVinculum) + "h-400000z";
  };
  var sqrtSize4 = function sqrtSize42(extraVinculum, hLinePad2) {
    return "M473," + (2713 + extraVinculum + hLinePad2) + "\nc339.3,-1799.3,509.3,-2700,510,-2702 l" + extraVinculum / 5.298 + " -" + extraVinculum + "\nc3.3,-7.3,9.3,-11,18,-11 H400000v" + (40 + extraVinculum) + "H1017.7\ns-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200\nc0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26\ns76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,\n606zM" + (1001 + extraVinculum) + " " + hLinePad2 + "h400000v" + (40 + extraVinculum) + "H1017.7z";
  };
  var phasePath = function phasePath2(y3) {
    var x3 = y3 / 2;
    return "M400000 " + y3 + " H0 L" + x3 + " 0 l65 45 L145 " + (y3 - 80) + " H400000z";
  };
  var sqrtTall = function sqrtTall2(extraVinculum, hLinePad2, viewBoxHeight) {
    var vertSegment = viewBoxHeight - 54 - hLinePad2 - extraVinculum;
    return "M702 " + (extraVinculum + hLinePad2) + "H400000" + (40 + extraVinculum) + "\nH742v" + vertSegment + "l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1\nh-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170\nc-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667\n219 661 l218 661zM702 " + hLinePad2 + "H400000v" + (40 + extraVinculum) + "H742z";
  };
  var sqrtPath = function sqrtPath2(size, extraVinculum, viewBoxHeight) {
    extraVinculum = 1e3 * extraVinculum;
    var path2 = "";
    switch (size) {
      case "sqrtMain":
        path2 = sqrtMain(extraVinculum, hLinePad);
        break;
      case "sqrtSize1":
        path2 = sqrtSize1(extraVinculum, hLinePad);
        break;
      case "sqrtSize2":
        path2 = sqrtSize2(extraVinculum, hLinePad);
        break;
      case "sqrtSize3":
        path2 = sqrtSize3(extraVinculum, hLinePad);
        break;
      case "sqrtSize4":
        path2 = sqrtSize4(extraVinculum, hLinePad);
        break;
      case "sqrtTall":
        path2 = sqrtTall(extraVinculum, hLinePad, viewBoxHeight);
    }
    return path2;
  };
  var innerPath = function innerPath2(name, height) {
    switch (name) {
      case "\u239C":
        return doubleBrushStroke("M291 0 H417 V" + height + " H291z");
      case "\u2223":
        return doubleBrushStroke("M145 0 H188 V" + height + " H145z");
      case "\u2225":
        return doubleBrushStroke("M145 0 H188 V" + height + " H145z") + doubleBrushStroke("M367 0 H410 V" + height + " H367z");
      case "\u239F":
        return doubleBrushStroke("M457 0 H583 V" + height + " H457z");
      case "\u23A2":
        return doubleBrushStroke("M319 0 H403 V" + height + " H319z");
      case "\u23A5":
        return doubleBrushStroke("M263 0 H347 V" + height + " H263z");
      case "\u23AA":
        return doubleBrushStroke("M384 0 H504 V" + height + " H384z");
      case "\u23D0":
        return doubleBrushStroke("M312 0 H355 V" + height + " H312z");
      case "\u2016":
        return doubleBrushStroke("M257 0 H300 V" + height + " H257z") + doubleBrushStroke("M478 0 H521 V" + height + " H478z");
      default:
        return "";
    }
  };
  var path = {
    // The doubleleftarrow geometry is from glyph U+21D0 in the font KaTeX Main
    doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
    // doublerightarrow is from glyph U+21D2 in font KaTeX Main
    doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
    // leftarrow is from glyph U+2190 in font KaTeX Main
    leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
    // overbrace is from glyphs U+23A9/23A8/23A7 in font KaTeX_Size4-Regular
    leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
    leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
    // overgroup is from the MnSymbol package (public domain)
    leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
    leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
    // Harpoons are from glyph U+21BD in font KaTeX Main
    leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
    leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
    leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
    leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
    // hook is from glyph U+21A9 in font KaTeX Main
    lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
    leftlinesegment: doubleBrushStroke("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),
    leftbracketunder: doubleBrushStroke("M0 0 h120 V290 H399995 v120 H0z"),
    leftbracketover: doubleBrushStroke("M0 440 h120 V150 H399995 v-120 H0z"),
    leftmapsto: doubleBrushStroke("M40 281 V448H0V74H40V241H400000v40z"),
    // tofrom is from glyph U+21C4 in font KaTeX AMS Regular
    leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
    longequal: doubleBrushStroke("M0 50 h400000 v40H0z m0 194h40000v40H0z"),
    midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
    midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
    oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
    oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
    oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
    oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
    rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
    rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
    rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
    rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
    rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
    rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
    rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
    rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
    rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
    righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
    rightlinesegment: doubleBrushStroke("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),
    rightbracketunder: doubleBrushStroke("M399995 0 h-120 V290 H0 v120 H400000z"),
    rightbracketover: doubleBrushStroke("M399995 440 h-120 V150 H0 v-120 H399995z"),
    rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
    // twoheadleftarrow is from glyph U+219E in font KaTeX AMS Regular
    twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
    twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
    // tilde1 is a modified version of a glyph from the MnSymbol package
    tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
    // ditto tilde2, tilde3, & tilde4
    tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
    tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
    tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
    // vec is from glyph U+20D7 in font KaTeX Main
    vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
    // widehat1 is a modified version of a glyph from the MnSymbol package
    widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
    // ditto widehat2, widehat3, & widehat4
    widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
    // widecheck paths are all inverted versions of widehat
    widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
    widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
    // The next ten paths support reaction arrows from the mhchem package.
    // Arrows for \ce{<-->} are offset from xAxis by 0.22ex, per mhchem in LaTeX
    // baraboveleftarrow is mostly from glyph U+2190 in font KaTeX Main
    baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
    // rightarrowabovebar is mostly from glyph U+2192, KaTeX Main
    rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
    // The short left harpoon has 0.5em (i.e. 500 units) kern on the left end.
    // Ref from mhchem.sty: \rlap{\raisebox{-.22ex}{$\kern0.5em
    baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
    rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
    shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
    shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
  };
  var tallDelim = function tallDelim2(label, midHeight) {
    switch (label) {
      case "lbrack":
        return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v1759 v84 h347 v-84\nH403z M403 1759 V0 H319 V1759 v" + midHeight + " v1759 v84 h84z";
      case "rbrack":
        return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v1759 H0 v84 H347z\nM347 1759 V0 H263 V1759 v" + midHeight + " v1759 h84z";
      case "vert":
        return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z";
      case "doublevert":
        return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z\nM367 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M410 15 H367 v585 v" + midHeight + " v585 h43z";
      case "lfloor":
        return "M319 602 V0 H403 V602 v" + midHeight + " v1715 h263 v84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
      case "rfloor":
        return "M319 602 V0 H403 V602 v" + midHeight + " v1799 H0 v-84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
      case "lceil":
        return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v602 h84z\nM403 1759 V0 H319 V1759 v" + midHeight + " v602 h84z";
      case "rceil":
        return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v602 h84z\nM347 1759 V0 h-84 V1759 v" + midHeight + " v602 h84z";
      case "lparen":
        return "M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1\nc-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,\n-36,557 l0," + (midHeight + 84) + "c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,\n949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9\nc0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,\n-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189\nl0,-" + (midHeight + 92) + "c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,\n-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z";
      case "rparen":
        return "M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,\n63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5\nc11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0," + (midHeight + 9) + "\nc-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664\nc-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11\nc0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17\nc242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558\nl0,-" + (midHeight + 144) + "c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,\n-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z";
      default:
        throw new Error("Unknown stretchy delimiter.");
    }
  };
  function isMathDomNode(node) {
    return "toText" in node;
  }
  var DocumentFragment = class {
    // Never used; needed for satisfying interface.
    constructor(children) {
      this.children = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      this.children = children;
      this.classes = [];
      this.height = 0;
      this.depth = 0;
      this.maxFontSize = 0;
      this.style = {};
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    /** Convert the fragment into a node. */
    toNode() {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < this.children.length; i++) {
        frag.appendChild(this.children[i].toNode());
      }
      return frag;
    }
    /** Convert the fragment into HTML markup. */
    toMarkup() {
      var markup = "";
      for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
      }
      return markup;
    }
    /**
     * Converts the math node into a string, similar to innerText. Applies to
     * MathDomNode's only.
     */
    toText() {
      return this.children.map((child) => {
        if (isMathDomNode(child)) {
          return child.toText();
        }
        throw new Error("Expected MathDomNode with toText, got " + child.constructor.name);
      }).join("");
    }
  };
  var ptPerUnit = {
    // https://en.wikibooks.org/wiki/LaTeX/Lengths and
    // https://tex.stackexchange.com/a/8263
    "pt": 1,
    // TeX point
    "mm": 7227 / 2540,
    // millimeter
    "cm": 7227 / 254,
    // centimeter
    "in": 72.27,
    // inch
    "bp": 803 / 800,
    // big (PostScript) points
    "pc": 12,
    // pica
    "dd": 1238 / 1157,
    // didot
    "cc": 14856 / 1157,
    // cicero (12 didot)
    "nd": 685 / 642,
    // new didot
    "nc": 1370 / 107,
    // new cicero (12 new didot)
    "sp": 1 / 65536,
    // scaled point (TeX's internal smallest unit)
    // https://tex.stackexchange.com/a/41371
    "px": 803 / 800
    // \pdfpxdimen defaults to 1 bp in pdfTeX and LuaTeX
  };
  var relativeUnit = {
    "ex": true,
    "em": true,
    "mu": true
  };
  var validUnit = function validUnit2(unit) {
    if (typeof unit !== "string") {
      unit = unit.unit;
    }
    return unit in ptPerUnit || unit in relativeUnit || unit === "ex";
  };
  var calculateSize = function calculateSize2(sizeValue, options) {
    var scale;
    if (sizeValue.unit in ptPerUnit) {
      scale = ptPerUnit[sizeValue.unit] / options.fontMetrics().ptPerEm / options.sizeMultiplier;
    } else if (sizeValue.unit === "mu") {
      scale = options.fontMetrics().cssEmPerMu;
    } else {
      var unitOptions;
      if (options.style.isTight()) {
        unitOptions = options.havingStyle(options.style.text());
      } else {
        unitOptions = options;
      }
      if (sizeValue.unit === "ex") {
        scale = unitOptions.fontMetrics().xHeight;
      } else if (sizeValue.unit === "em") {
        scale = unitOptions.fontMetrics().quad;
      } else {
        throw new ParseError("Invalid unit: '" + sizeValue.unit + "'");
      }
      if (unitOptions !== options) {
        scale *= unitOptions.sizeMultiplier / options.sizeMultiplier;
      }
    }
    return Math.min(sizeValue.number * scale, options.maxSize);
  };
  var makeEm = function makeEm2(n) {
    return +n.toFixed(4) + "em";
  };
  var createClass = function createClass2(classes) {
    return classes.filter((cls) => cls).join(" ");
  };
  var cssStyleToString = function cssStyleToString2(style) {
    var styles2 = "";
    for (var key of Object.keys(style)) {
      var value = style[key];
      if (value !== void 0) {
        styles2 += hyphenate(key) + ":" + value + ";";
      }
    }
    return styles2;
  };
  var initNode = function initNode2(classes, options, style) {
    this.classes = classes || [];
    this.attributes = {};
    this.height = 0;
    this.depth = 0;
    this.maxFontSize = 0;
    this.style = style || {};
    if (options) {
      if (options.style.isTight()) {
        this.classes.push("mtight");
      }
      var color = options.getColor();
      if (color) {
        this.style.color = color;
      }
    }
  };
  var toNode = function toNode2(tagName) {
    var node = document.createElement(tagName);
    node.className = createClass(this.classes);
    Object.assign(node.style, this.style);
    for (var attr of Object.keys(this.attributes)) {
      node.setAttribute(attr, this.attributes[attr]);
    }
    for (var i = 0; i < this.children.length; i++) {
      node.appendChild(this.children[i].toNode());
    }
    return node;
  };
  var invalidAttributeNameRegex = /[\s"'>/=\x00-\x1f]/;
  var toMarkup = function toMarkup2(tagName) {
    var markup = "<" + tagName;
    if (this.classes.length) {
      markup += ' class="' + escape(createClass(this.classes)) + '"';
    }
    var styles2 = cssStyleToString(this.style);
    if (styles2) {
      markup += ' style="' + escape(styles2) + '"';
    }
    for (var attr of Object.keys(this.attributes)) {
      if (invalidAttributeNameRegex.test(attr)) {
        throw new ParseError("Invalid attribute name '" + attr + "'");
      }
      markup += " " + attr + '="' + escape(this.attributes[attr]) + '"';
    }
    markup += ">";
    for (var i = 0; i < this.children.length; i++) {
      markup += this.children[i].toMarkup();
    }
    markup += "</" + tagName + ">";
    return markup;
  };
  var Span = class {
    constructor(classes, children, options, style) {
      this.children = void 0;
      this.attributes = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.width = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      this.italic = void 0;
      initNode.call(this, classes, options, style);
      this.children = children || [];
    }
    /**
     * Sets an arbitrary attribute on the span. Warning: use this wisely. Not
     * all browsers support attributes the same, and having too many custom
     * attributes is probably bad.
     */
    setAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      return toNode.call(this, "span");
    }
    toMarkup() {
      return toMarkup.call(this, "span");
    }
  };
  var Anchor = class {
    constructor(href, classes, children, options) {
      this.children = void 0;
      this.attributes = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      initNode.call(this, classes, options);
      this.children = children || [];
      this.setAttribute("href", href);
    }
    setAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      return toNode.call(this, "a");
    }
    toMarkup() {
      return toMarkup.call(this, "a");
    }
  };
  var Img = class {
    constructor(src, alt, style) {
      this.src = void 0;
      this.alt = void 0;
      this.classes = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.maxFontSize = void 0;
      this.style = void 0;
      this.alt = alt;
      this.src = src;
      this.classes = ["mord"];
      this.height = 0;
      this.depth = 0;
      this.maxFontSize = 0;
      this.style = style;
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    toNode() {
      var node = document.createElement("img");
      node.src = this.src;
      node.alt = this.alt;
      node.className = "mord";
      Object.assign(node.style, this.style);
      return node;
    }
    toMarkup() {
      var markup = '<img src="' + escape(this.src) + '"' + (' alt="' + escape(this.alt) + '"');
      var styles2 = cssStyleToString(this.style);
      if (styles2) {
        markup += ' style="' + escape(styles2) + '"';
      }
      markup += "'/>";
      return markup;
    }
  };
  var iCombinations = {
    "\xEE": "\u0131\u0302",
    "\xEF": "\u0131\u0308",
    "\xED": "\u0131\u0301",
    // 'ī': '\u0131\u0304', // enable when we add Extended Latin
    "\xEC": "\u0131\u0300"
  };
  var SymbolNode = class {
    constructor(text4, height, depth, italic2, skew, width, classes, style) {
      this.text = void 0;
      this.height = void 0;
      this.depth = void 0;
      this.italic = void 0;
      this.skew = void 0;
      this.width = void 0;
      this.maxFontSize = void 0;
      this.classes = void 0;
      this.style = void 0;
      this.text = text4;
      this.height = height || 0;
      this.depth = depth || 0;
      this.italic = italic2 || 0;
      this.skew = skew || 0;
      this.width = width || 0;
      this.classes = classes || [];
      this.style = style || {};
      this.maxFontSize = 0;
      var script2 = scriptFromCodepoint(this.text.charCodeAt(0));
      if (script2) {
        this.classes.push(script2 + "_fallback");
      }
      if (/[îïíì]/.test(this.text)) {
        this.text = iCombinations[this.text];
      }
    }
    hasClass(className) {
      return this.classes.includes(className);
    }
    /**
     * Creates a text node or span from a symbol node. Note that a span is only
     * created if it is needed.
     */
    toNode() {
      var node = document.createTextNode(this.text);
      var span = null;
      if (this.italic > 0) {
        span = document.createElement("span");
        span.style.marginRight = makeEm(this.italic);
      }
      if (this.classes.length > 0) {
        span = span || document.createElement("span");
        span.className = createClass(this.classes);
      }
      if (Object.keys(this.style).length > 0) {
        span = span || document.createElement("span");
        Object.assign(span.style, this.style);
      }
      if (span) {
        span.appendChild(node);
        return span;
      } else {
        return node;
      }
    }
    /**
     * Creates markup for a symbol node.
     */
    toMarkup() {
      var needsSpan = false;
      var markup = "<span";
      if (this.classes.length) {
        needsSpan = true;
        markup += ' class="';
        markup += escape(createClass(this.classes));
        markup += '"';
      }
      var styles2 = "";
      if (this.italic > 0) {
        styles2 += "margin-right:" + makeEm(this.italic) + ";";
      }
      styles2 += cssStyleToString(this.style);
      if (styles2) {
        needsSpan = true;
        markup += ' style="' + escape(styles2) + '"';
      }
      var escaped = escape(this.text);
      if (needsSpan) {
        markup += ">";
        markup += escaped;
        markup += "</span>";
        return markup;
      } else {
        return escaped;
      }
    }
  };
  var SvgNode = class {
    constructor(children, attributes) {
      this.children = void 0;
      this.attributes = void 0;
      this.children = children || [];
      this.attributes = attributes || {};
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "svg");
      for (var attr of Object.keys(this.attributes)) {
        node.setAttribute(attr, this.attributes[attr]);
      }
      for (var i = 0; i < this.children.length; i++) {
        node.appendChild(this.children[i].toNode());
      }
      return node;
    }
    toMarkup() {
      var markup = '<svg xmlns="http://www.w3.org/2000/svg"';
      for (var attr of Object.keys(this.attributes)) {
        markup += " " + attr + '="' + escape(this.attributes[attr]) + '"';
      }
      markup += ">";
      for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
      }
      markup += "</svg>";
      return markup;
    }
  };
  var PathNode = class {
    constructor(pathName, alternate) {
      this.pathName = void 0;
      this.alternate = void 0;
      this.pathName = pathName;
      this.alternate = alternate;
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "path");
      if (this.alternate) {
        node.setAttribute("d", this.alternate);
      } else {
        node.setAttribute("d", path[this.pathName]);
      }
      return node;
    }
    toMarkup() {
      if (this.alternate) {
        return '<path d="' + escape(this.alternate) + '"/>';
      } else {
        return '<path d="' + escape(path[this.pathName]) + '"/>';
      }
    }
  };
  var LineNode = class {
    constructor(attributes) {
      this.attributes = void 0;
      this.attributes = attributes || {};
    }
    toNode() {
      var svgNS = "http://www.w3.org/2000/svg";
      var node = document.createElementNS(svgNS, "line");
      for (var attr of Object.keys(this.attributes)) {
        node.setAttribute(attr, this.attributes[attr]);
      }
      return node;
    }
    toMarkup() {
      var markup = "<line";
      for (var attr of Object.keys(this.attributes)) {
        markup += " " + attr + '="' + escape(this.attributes[attr]) + '"';
      }
      markup += "/>";
      return markup;
    }
  };
  function assertSymbolDomNode(group) {
    if (group instanceof SymbolNode) {
      return group;
    } else {
      throw new Error("Expected symbolNode but got " + String(group) + ".");
    }
  }
  function assertSpan(group) {
    if (group instanceof Span) {
      return group;
    } else {
      throw new Error("Expected span<HtmlDomNode> but got " + String(group) + ".");
    }
  }
  var hasHtmlDomChildren = (node) => node instanceof Span || node instanceof Anchor || node instanceof DocumentFragment;
  var fontMetricsData = {
    "AMS-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.68889, 0, 0, 0.72222],
      "66": [0, 0.68889, 0, 0, 0.66667],
      "67": [0, 0.68889, 0, 0, 0.72222],
      "68": [0, 0.68889, 0, 0, 0.72222],
      "69": [0, 0.68889, 0, 0, 0.66667],
      "70": [0, 0.68889, 0, 0, 0.61111],
      "71": [0, 0.68889, 0, 0, 0.77778],
      "72": [0, 0.68889, 0, 0, 0.77778],
      "73": [0, 0.68889, 0, 0, 0.38889],
      "74": [0.16667, 0.68889, 0, 0, 0.5],
      "75": [0, 0.68889, 0, 0, 0.77778],
      "76": [0, 0.68889, 0, 0, 0.66667],
      "77": [0, 0.68889, 0, 0, 0.94445],
      "78": [0, 0.68889, 0, 0, 0.72222],
      "79": [0.16667, 0.68889, 0, 0, 0.77778],
      "80": [0, 0.68889, 0, 0, 0.61111],
      "81": [0.16667, 0.68889, 0, 0, 0.77778],
      "82": [0, 0.68889, 0, 0, 0.72222],
      "83": [0, 0.68889, 0, 0, 0.55556],
      "84": [0, 0.68889, 0, 0, 0.66667],
      "85": [0, 0.68889, 0, 0, 0.72222],
      "86": [0, 0.68889, 0, 0, 0.72222],
      "87": [0, 0.68889, 0, 0, 1],
      "88": [0, 0.68889, 0, 0, 0.72222],
      "89": [0, 0.68889, 0, 0, 0.72222],
      "90": [0, 0.68889, 0, 0, 0.66667],
      "107": [0, 0.68889, 0, 0, 0.55556],
      "160": [0, 0, 0, 0, 0.25],
      "165": [0, 0.675, 0.025, 0, 0.75],
      "174": [0.15559, 0.69224, 0, 0, 0.94666],
      "240": [0, 0.68889, 0, 0, 0.55556],
      "295": [0, 0.68889, 0, 0, 0.54028],
      "710": [0, 0.825, 0, 0, 2.33334],
      "732": [0, 0.9, 0, 0, 2.33334],
      "770": [0, 0.825, 0, 0, 2.33334],
      "771": [0, 0.9, 0, 0, 2.33334],
      "989": [0.08167, 0.58167, 0, 0, 0.77778],
      "1008": [0, 0.43056, 0.04028, 0, 0.66667],
      "8245": [0, 0.54986, 0, 0, 0.275],
      "8463": [0, 0.68889, 0, 0, 0.54028],
      "8487": [0, 0.68889, 0, 0, 0.72222],
      "8498": [0, 0.68889, 0, 0, 0.55556],
      "8502": [0, 0.68889, 0, 0, 0.66667],
      "8503": [0, 0.68889, 0, 0, 0.44445],
      "8504": [0, 0.68889, 0, 0, 0.66667],
      "8513": [0, 0.68889, 0, 0, 0.63889],
      "8592": [-0.03598, 0.46402, 0, 0, 0.5],
      "8594": [-0.03598, 0.46402, 0, 0, 0.5],
      "8602": [-0.13313, 0.36687, 0, 0, 1],
      "8603": [-0.13313, 0.36687, 0, 0, 1],
      "8606": [0.01354, 0.52239, 0, 0, 1],
      "8608": [0.01354, 0.52239, 0, 0, 1],
      "8610": [0.01354, 0.52239, 0, 0, 1.11111],
      "8611": [0.01354, 0.52239, 0, 0, 1.11111],
      "8619": [0, 0.54986, 0, 0, 1],
      "8620": [0, 0.54986, 0, 0, 1],
      "8621": [-0.13313, 0.37788, 0, 0, 1.38889],
      "8622": [-0.13313, 0.36687, 0, 0, 1],
      "8624": [0, 0.69224, 0, 0, 0.5],
      "8625": [0, 0.69224, 0, 0, 0.5],
      "8630": [0, 0.43056, 0, 0, 1],
      "8631": [0, 0.43056, 0, 0, 1],
      "8634": [0.08198, 0.58198, 0, 0, 0.77778],
      "8635": [0.08198, 0.58198, 0, 0, 0.77778],
      "8638": [0.19444, 0.69224, 0, 0, 0.41667],
      "8639": [0.19444, 0.69224, 0, 0, 0.41667],
      "8642": [0.19444, 0.69224, 0, 0, 0.41667],
      "8643": [0.19444, 0.69224, 0, 0, 0.41667],
      "8644": [0.1808, 0.675, 0, 0, 1],
      "8646": [0.1808, 0.675, 0, 0, 1],
      "8647": [0.1808, 0.675, 0, 0, 1],
      "8648": [0.19444, 0.69224, 0, 0, 0.83334],
      "8649": [0.1808, 0.675, 0, 0, 1],
      "8650": [0.19444, 0.69224, 0, 0, 0.83334],
      "8651": [0.01354, 0.52239, 0, 0, 1],
      "8652": [0.01354, 0.52239, 0, 0, 1],
      "8653": [-0.13313, 0.36687, 0, 0, 1],
      "8654": [-0.13313, 0.36687, 0, 0, 1],
      "8655": [-0.13313, 0.36687, 0, 0, 1],
      "8666": [0.13667, 0.63667, 0, 0, 1],
      "8667": [0.13667, 0.63667, 0, 0, 1],
      "8669": [-0.13313, 0.37788, 0, 0, 1],
      "8672": [-0.064, 0.437, 0, 0, 1.334],
      "8674": [-0.064, 0.437, 0, 0, 1.334],
      "8705": [0, 0.825, 0, 0, 0.5],
      "8708": [0, 0.68889, 0, 0, 0.55556],
      "8709": [0.08167, 0.58167, 0, 0, 0.77778],
      "8717": [0, 0.43056, 0, 0, 0.42917],
      "8722": [-0.03598, 0.46402, 0, 0, 0.5],
      "8724": [0.08198, 0.69224, 0, 0, 0.77778],
      "8726": [0.08167, 0.58167, 0, 0, 0.77778],
      "8733": [0, 0.69224, 0, 0, 0.77778],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8737": [0, 0.69224, 0, 0, 0.72222],
      "8738": [0.03517, 0.52239, 0, 0, 0.72222],
      "8739": [0.08167, 0.58167, 0, 0, 0.22222],
      "8740": [0.25142, 0.74111, 0, 0, 0.27778],
      "8741": [0.08167, 0.58167, 0, 0, 0.38889],
      "8742": [0.25142, 0.74111, 0, 0, 0.5],
      "8756": [0, 0.69224, 0, 0, 0.66667],
      "8757": [0, 0.69224, 0, 0, 0.66667],
      "8764": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8765": [-0.13313, 0.37788, 0, 0, 0.77778],
      "8769": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8770": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8774": [0.30274, 0.79383, 0, 0, 0.77778],
      "8776": [-0.01688, 0.48312, 0, 0, 0.77778],
      "8778": [0.08167, 0.58167, 0, 0, 0.77778],
      "8782": [0.06062, 0.54986, 0, 0, 0.77778],
      "8783": [0.06062, 0.54986, 0, 0, 0.77778],
      "8785": [0.08198, 0.58198, 0, 0, 0.77778],
      "8786": [0.08198, 0.58198, 0, 0, 0.77778],
      "8787": [0.08198, 0.58198, 0, 0, 0.77778],
      "8790": [0, 0.69224, 0, 0, 0.77778],
      "8791": [0.22958, 0.72958, 0, 0, 0.77778],
      "8796": [0.08198, 0.91667, 0, 0, 0.77778],
      "8806": [0.25583, 0.75583, 0, 0, 0.77778],
      "8807": [0.25583, 0.75583, 0, 0, 0.77778],
      "8808": [0.25142, 0.75726, 0, 0, 0.77778],
      "8809": [0.25142, 0.75726, 0, 0, 0.77778],
      "8812": [0.25583, 0.75583, 0, 0, 0.5],
      "8814": [0.20576, 0.70576, 0, 0, 0.77778],
      "8815": [0.20576, 0.70576, 0, 0, 0.77778],
      "8816": [0.30274, 0.79383, 0, 0, 0.77778],
      "8817": [0.30274, 0.79383, 0, 0, 0.77778],
      "8818": [0.22958, 0.72958, 0, 0, 0.77778],
      "8819": [0.22958, 0.72958, 0, 0, 0.77778],
      "8822": [0.1808, 0.675, 0, 0, 0.77778],
      "8823": [0.1808, 0.675, 0, 0, 0.77778],
      "8828": [0.13667, 0.63667, 0, 0, 0.77778],
      "8829": [0.13667, 0.63667, 0, 0, 0.77778],
      "8830": [0.22958, 0.72958, 0, 0, 0.77778],
      "8831": [0.22958, 0.72958, 0, 0, 0.77778],
      "8832": [0.20576, 0.70576, 0, 0, 0.77778],
      "8833": [0.20576, 0.70576, 0, 0, 0.77778],
      "8840": [0.30274, 0.79383, 0, 0, 0.77778],
      "8841": [0.30274, 0.79383, 0, 0, 0.77778],
      "8842": [0.13597, 0.63597, 0, 0, 0.77778],
      "8843": [0.13597, 0.63597, 0, 0, 0.77778],
      "8847": [0.03517, 0.54986, 0, 0, 0.77778],
      "8848": [0.03517, 0.54986, 0, 0, 0.77778],
      "8858": [0.08198, 0.58198, 0, 0, 0.77778],
      "8859": [0.08198, 0.58198, 0, 0, 0.77778],
      "8861": [0.08198, 0.58198, 0, 0, 0.77778],
      "8862": [0, 0.675, 0, 0, 0.77778],
      "8863": [0, 0.675, 0, 0, 0.77778],
      "8864": [0, 0.675, 0, 0, 0.77778],
      "8865": [0, 0.675, 0, 0, 0.77778],
      "8872": [0, 0.69224, 0, 0, 0.61111],
      "8873": [0, 0.69224, 0, 0, 0.72222],
      "8874": [0, 0.69224, 0, 0, 0.88889],
      "8876": [0, 0.68889, 0, 0, 0.61111],
      "8877": [0, 0.68889, 0, 0, 0.61111],
      "8878": [0, 0.68889, 0, 0, 0.72222],
      "8879": [0, 0.68889, 0, 0, 0.72222],
      "8882": [0.03517, 0.54986, 0, 0, 0.77778],
      "8883": [0.03517, 0.54986, 0, 0, 0.77778],
      "8884": [0.13667, 0.63667, 0, 0, 0.77778],
      "8885": [0.13667, 0.63667, 0, 0, 0.77778],
      "8888": [0, 0.54986, 0, 0, 1.11111],
      "8890": [0.19444, 0.43056, 0, 0, 0.55556],
      "8891": [0.19444, 0.69224, 0, 0, 0.61111],
      "8892": [0.19444, 0.69224, 0, 0, 0.61111],
      "8901": [0, 0.54986, 0, 0, 0.27778],
      "8903": [0.08167, 0.58167, 0, 0, 0.77778],
      "8905": [0.08167, 0.58167, 0, 0, 0.77778],
      "8906": [0.08167, 0.58167, 0, 0, 0.77778],
      "8907": [0, 0.69224, 0, 0, 0.77778],
      "8908": [0, 0.69224, 0, 0, 0.77778],
      "8909": [-0.03598, 0.46402, 0, 0, 0.77778],
      "8910": [0, 0.54986, 0, 0, 0.76042],
      "8911": [0, 0.54986, 0, 0, 0.76042],
      "8912": [0.03517, 0.54986, 0, 0, 0.77778],
      "8913": [0.03517, 0.54986, 0, 0, 0.77778],
      "8914": [0, 0.54986, 0, 0, 0.66667],
      "8915": [0, 0.54986, 0, 0, 0.66667],
      "8916": [0, 0.69224, 0, 0, 0.66667],
      "8918": [0.0391, 0.5391, 0, 0, 0.77778],
      "8919": [0.0391, 0.5391, 0, 0, 0.77778],
      "8920": [0.03517, 0.54986, 0, 0, 1.33334],
      "8921": [0.03517, 0.54986, 0, 0, 1.33334],
      "8922": [0.38569, 0.88569, 0, 0, 0.77778],
      "8923": [0.38569, 0.88569, 0, 0, 0.77778],
      "8926": [0.13667, 0.63667, 0, 0, 0.77778],
      "8927": [0.13667, 0.63667, 0, 0, 0.77778],
      "8928": [0.30274, 0.79383, 0, 0, 0.77778],
      "8929": [0.30274, 0.79383, 0, 0, 0.77778],
      "8934": [0.23222, 0.74111, 0, 0, 0.77778],
      "8935": [0.23222, 0.74111, 0, 0, 0.77778],
      "8936": [0.23222, 0.74111, 0, 0, 0.77778],
      "8937": [0.23222, 0.74111, 0, 0, 0.77778],
      "8938": [0.20576, 0.70576, 0, 0, 0.77778],
      "8939": [0.20576, 0.70576, 0, 0, 0.77778],
      "8940": [0.30274, 0.79383, 0, 0, 0.77778],
      "8941": [0.30274, 0.79383, 0, 0, 0.77778],
      "8994": [0.19444, 0.69224, 0, 0, 0.77778],
      "8995": [0.19444, 0.69224, 0, 0, 0.77778],
      "9416": [0.15559, 0.69224, 0, 0, 0.90222],
      "9484": [0, 0.69224, 0, 0, 0.5],
      "9488": [0, 0.69224, 0, 0, 0.5],
      "9492": [0, 0.37788, 0, 0, 0.5],
      "9496": [0, 0.37788, 0, 0, 0.5],
      "9585": [0.19444, 0.68889, 0, 0, 0.88889],
      "9586": [0.19444, 0.74111, 0, 0, 0.88889],
      "9632": [0, 0.675, 0, 0, 0.77778],
      "9633": [0, 0.675, 0, 0, 0.77778],
      "9650": [0, 0.54986, 0, 0, 0.72222],
      "9651": [0, 0.54986, 0, 0, 0.72222],
      "9654": [0.03517, 0.54986, 0, 0, 0.77778],
      "9660": [0, 0.54986, 0, 0, 0.72222],
      "9661": [0, 0.54986, 0, 0, 0.72222],
      "9664": [0.03517, 0.54986, 0, 0, 0.77778],
      "9674": [0.11111, 0.69224, 0, 0, 0.66667],
      "9733": [0.19444, 0.69224, 0, 0, 0.94445],
      "10003": [0, 0.69224, 0, 0, 0.83334],
      "10016": [0, 0.69224, 0, 0, 0.83334],
      "10731": [0.11111, 0.69224, 0, 0, 0.66667],
      "10846": [0.19444, 0.75583, 0, 0, 0.61111],
      "10877": [0.13667, 0.63667, 0, 0, 0.77778],
      "10878": [0.13667, 0.63667, 0, 0, 0.77778],
      "10885": [0.25583, 0.75583, 0, 0, 0.77778],
      "10886": [0.25583, 0.75583, 0, 0, 0.77778],
      "10887": [0.13597, 0.63597, 0, 0, 0.77778],
      "10888": [0.13597, 0.63597, 0, 0, 0.77778],
      "10889": [0.26167, 0.75726, 0, 0, 0.77778],
      "10890": [0.26167, 0.75726, 0, 0, 0.77778],
      "10891": [0.48256, 0.98256, 0, 0, 0.77778],
      "10892": [0.48256, 0.98256, 0, 0, 0.77778],
      "10901": [0.13667, 0.63667, 0, 0, 0.77778],
      "10902": [0.13667, 0.63667, 0, 0, 0.77778],
      "10933": [0.25142, 0.75726, 0, 0, 0.77778],
      "10934": [0.25142, 0.75726, 0, 0, 0.77778],
      "10935": [0.26167, 0.75726, 0, 0, 0.77778],
      "10936": [0.26167, 0.75726, 0, 0, 0.77778],
      "10937": [0.26167, 0.75726, 0, 0, 0.77778],
      "10938": [0.26167, 0.75726, 0, 0, 0.77778],
      "10949": [0.25583, 0.75583, 0, 0, 0.77778],
      "10950": [0.25583, 0.75583, 0, 0, 0.77778],
      "10955": [0.28481, 0.79383, 0, 0, 0.77778],
      "10956": [0.28481, 0.79383, 0, 0, 0.77778],
      "57350": [0.08167, 0.58167, 0, 0, 0.22222],
      "57351": [0.08167, 0.58167, 0, 0, 0.38889],
      "57352": [0.08167, 0.58167, 0, 0, 0.77778],
      "57353": [0, 0.43056, 0.04028, 0, 0.66667],
      "57356": [0.25142, 0.75726, 0, 0, 0.77778],
      "57357": [0.25142, 0.75726, 0, 0, 0.77778],
      "57358": [0.41951, 0.91951, 0, 0, 0.77778],
      "57359": [0.30274, 0.79383, 0, 0, 0.77778],
      "57360": [0.30274, 0.79383, 0, 0, 0.77778],
      "57361": [0.41951, 0.91951, 0, 0, 0.77778],
      "57366": [0.25142, 0.75726, 0, 0, 0.77778],
      "57367": [0.25142, 0.75726, 0, 0, 0.77778],
      "57368": [0.25142, 0.75726, 0, 0, 0.77778],
      "57369": [0.25142, 0.75726, 0, 0, 0.77778],
      "57370": [0.13597, 0.63597, 0, 0, 0.77778],
      "57371": [0.13597, 0.63597, 0, 0, 0.77778]
    },
    "Caligraphic-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.68333, 0, 0.19445, 0.79847],
      "66": [0, 0.68333, 0.03041, 0.13889, 0.65681],
      "67": [0, 0.68333, 0.05834, 0.13889, 0.52653],
      "68": [0, 0.68333, 0.02778, 0.08334, 0.77139],
      "69": [0, 0.68333, 0.08944, 0.11111, 0.52778],
      "70": [0, 0.68333, 0.09931, 0.11111, 0.71875],
      "71": [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
      "72": [0, 0.68333, 965e-5, 0.11111, 0.84452],
      "73": [0, 0.68333, 0.07382, 0, 0.54452],
      "74": [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
      "75": [0, 0.68333, 0.01445, 0.05556, 0.76195],
      "76": [0, 0.68333, 0, 0.13889, 0.68972],
      "77": [0, 0.68333, 0, 0.13889, 1.2009],
      "78": [0, 0.68333, 0.14736, 0.08334, 0.82049],
      "79": [0, 0.68333, 0.02778, 0.11111, 0.79611],
      "80": [0, 0.68333, 0.08222, 0.08334, 0.69556],
      "81": [0.09722, 0.68333, 0, 0.11111, 0.81667],
      "82": [0, 0.68333, 0, 0.08334, 0.8475],
      "83": [0, 0.68333, 0.075, 0.13889, 0.60556],
      "84": [0, 0.68333, 0.25417, 0, 0.54464],
      "85": [0, 0.68333, 0.09931, 0.08334, 0.62583],
      "86": [0, 0.68333, 0.08222, 0, 0.61278],
      "87": [0, 0.68333, 0.08222, 0.08334, 0.98778],
      "88": [0, 0.68333, 0.14643, 0.13889, 0.7133],
      "89": [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
      "90": [0, 0.68333, 0.07944, 0.13889, 0.72473],
      "160": [0, 0, 0, 0, 0.25]
    },
    "Fraktur-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69141, 0, 0, 0.29574],
      "34": [0, 0.69141, 0, 0, 0.21471],
      "38": [0, 0.69141, 0, 0, 0.73786],
      "39": [0, 0.69141, 0, 0, 0.21201],
      "40": [0.24982, 0.74947, 0, 0, 0.38865],
      "41": [0.24982, 0.74947, 0, 0, 0.38865],
      "42": [0, 0.62119, 0, 0, 0.27764],
      "43": [0.08319, 0.58283, 0, 0, 0.75623],
      "44": [0, 0.10803, 0, 0, 0.27764],
      "45": [0.08319, 0.58283, 0, 0, 0.75623],
      "46": [0, 0.10803, 0, 0, 0.27764],
      "47": [0.24982, 0.74947, 0, 0, 0.50181],
      "48": [0, 0.47534, 0, 0, 0.50181],
      "49": [0, 0.47534, 0, 0, 0.50181],
      "50": [0, 0.47534, 0, 0, 0.50181],
      "51": [0.18906, 0.47534, 0, 0, 0.50181],
      "52": [0.18906, 0.47534, 0, 0, 0.50181],
      "53": [0.18906, 0.47534, 0, 0, 0.50181],
      "54": [0, 0.69141, 0, 0, 0.50181],
      "55": [0.18906, 0.47534, 0, 0, 0.50181],
      "56": [0, 0.69141, 0, 0, 0.50181],
      "57": [0.18906, 0.47534, 0, 0, 0.50181],
      "58": [0, 0.47534, 0, 0, 0.21606],
      "59": [0.12604, 0.47534, 0, 0, 0.21606],
      "61": [-0.13099, 0.36866, 0, 0, 0.75623],
      "63": [0, 0.69141, 0, 0, 0.36245],
      "65": [0, 0.69141, 0, 0, 0.7176],
      "66": [0, 0.69141, 0, 0, 0.88397],
      "67": [0, 0.69141, 0, 0, 0.61254],
      "68": [0, 0.69141, 0, 0, 0.83158],
      "69": [0, 0.69141, 0, 0, 0.66278],
      "70": [0.12604, 0.69141, 0, 0, 0.61119],
      "71": [0, 0.69141, 0, 0, 0.78539],
      "72": [0.06302, 0.69141, 0, 0, 0.7203],
      "73": [0, 0.69141, 0, 0, 0.55448],
      "74": [0.12604, 0.69141, 0, 0, 0.55231],
      "75": [0, 0.69141, 0, 0, 0.66845],
      "76": [0, 0.69141, 0, 0, 0.66602],
      "77": [0, 0.69141, 0, 0, 1.04953],
      "78": [0, 0.69141, 0, 0, 0.83212],
      "79": [0, 0.69141, 0, 0, 0.82699],
      "80": [0.18906, 0.69141, 0, 0, 0.82753],
      "81": [0.03781, 0.69141, 0, 0, 0.82699],
      "82": [0, 0.69141, 0, 0, 0.82807],
      "83": [0, 0.69141, 0, 0, 0.82861],
      "84": [0, 0.69141, 0, 0, 0.66899],
      "85": [0, 0.69141, 0, 0, 0.64576],
      "86": [0, 0.69141, 0, 0, 0.83131],
      "87": [0, 0.69141, 0, 0, 1.04602],
      "88": [0, 0.69141, 0, 0, 0.71922],
      "89": [0.18906, 0.69141, 0, 0, 0.83293],
      "90": [0.12604, 0.69141, 0, 0, 0.60201],
      "91": [0.24982, 0.74947, 0, 0, 0.27764],
      "93": [0.24982, 0.74947, 0, 0, 0.27764],
      "94": [0, 0.69141, 0, 0, 0.49965],
      "97": [0, 0.47534, 0, 0, 0.50046],
      "98": [0, 0.69141, 0, 0, 0.51315],
      "99": [0, 0.47534, 0, 0, 0.38946],
      "100": [0, 0.62119, 0, 0, 0.49857],
      "101": [0, 0.47534, 0, 0, 0.40053],
      "102": [0.18906, 0.69141, 0, 0, 0.32626],
      "103": [0.18906, 0.47534, 0, 0, 0.5037],
      "104": [0.18906, 0.69141, 0, 0, 0.52126],
      "105": [0, 0.69141, 0, 0, 0.27899],
      "106": [0, 0.69141, 0, 0, 0.28088],
      "107": [0, 0.69141, 0, 0, 0.38946],
      "108": [0, 0.69141, 0, 0, 0.27953],
      "109": [0, 0.47534, 0, 0, 0.76676],
      "110": [0, 0.47534, 0, 0, 0.52666],
      "111": [0, 0.47534, 0, 0, 0.48885],
      "112": [0.18906, 0.52396, 0, 0, 0.50046],
      "113": [0.18906, 0.47534, 0, 0, 0.48912],
      "114": [0, 0.47534, 0, 0, 0.38919],
      "115": [0, 0.47534, 0, 0, 0.44266],
      "116": [0, 0.62119, 0, 0, 0.33301],
      "117": [0, 0.47534, 0, 0, 0.5172],
      "118": [0, 0.52396, 0, 0, 0.5118],
      "119": [0, 0.52396, 0, 0, 0.77351],
      "120": [0.18906, 0.47534, 0, 0, 0.38865],
      "121": [0.18906, 0.47534, 0, 0, 0.49884],
      "122": [0.18906, 0.47534, 0, 0, 0.39054],
      "160": [0, 0, 0, 0, 0.25],
      "8216": [0, 0.69141, 0, 0, 0.21471],
      "8217": [0, 0.69141, 0, 0, 0.21471],
      "58112": [0, 0.62119, 0, 0, 0.49749],
      "58113": [0, 0.62119, 0, 0, 0.4983],
      "58114": [0.18906, 0.69141, 0, 0, 0.33328],
      "58115": [0.18906, 0.69141, 0, 0, 0.32923],
      "58116": [0.18906, 0.47534, 0, 0, 0.50343],
      "58117": [0, 0.69141, 0, 0, 0.33301],
      "58118": [0, 0.62119, 0, 0, 0.33409],
      "58119": [0, 0.47534, 0, 0, 0.50073]
    },
    "Main-Bold": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.35],
      "34": [0, 0.69444, 0, 0, 0.60278],
      "35": [0.19444, 0.69444, 0, 0, 0.95833],
      "36": [0.05556, 0.75, 0, 0, 0.575],
      "37": [0.05556, 0.75, 0, 0, 0.95833],
      "38": [0, 0.69444, 0, 0, 0.89444],
      "39": [0, 0.69444, 0, 0, 0.31944],
      "40": [0.25, 0.75, 0, 0, 0.44722],
      "41": [0.25, 0.75, 0, 0, 0.44722],
      "42": [0, 0.75, 0, 0, 0.575],
      "43": [0.13333, 0.63333, 0, 0, 0.89444],
      "44": [0.19444, 0.15556, 0, 0, 0.31944],
      "45": [0, 0.44444, 0, 0, 0.38333],
      "46": [0, 0.15556, 0, 0, 0.31944],
      "47": [0.25, 0.75, 0, 0, 0.575],
      "48": [0, 0.64444, 0, 0, 0.575],
      "49": [0, 0.64444, 0, 0, 0.575],
      "50": [0, 0.64444, 0, 0, 0.575],
      "51": [0, 0.64444, 0, 0, 0.575],
      "52": [0, 0.64444, 0, 0, 0.575],
      "53": [0, 0.64444, 0, 0, 0.575],
      "54": [0, 0.64444, 0, 0, 0.575],
      "55": [0, 0.64444, 0, 0, 0.575],
      "56": [0, 0.64444, 0, 0, 0.575],
      "57": [0, 0.64444, 0, 0, 0.575],
      "58": [0, 0.44444, 0, 0, 0.31944],
      "59": [0.19444, 0.44444, 0, 0, 0.31944],
      "60": [0.08556, 0.58556, 0, 0, 0.89444],
      "61": [-0.10889, 0.39111, 0, 0, 0.89444],
      "62": [0.08556, 0.58556, 0, 0, 0.89444],
      "63": [0, 0.69444, 0, 0, 0.54305],
      "64": [0, 0.69444, 0, 0, 0.89444],
      "65": [0, 0.68611, 0, 0, 0.86944],
      "66": [0, 0.68611, 0, 0, 0.81805],
      "67": [0, 0.68611, 0, 0, 0.83055],
      "68": [0, 0.68611, 0, 0, 0.88194],
      "69": [0, 0.68611, 0, 0, 0.75555],
      "70": [0, 0.68611, 0, 0, 0.72361],
      "71": [0, 0.68611, 0, 0, 0.90416],
      "72": [0, 0.68611, 0, 0, 0.9],
      "73": [0, 0.68611, 0, 0, 0.43611],
      "74": [0, 0.68611, 0, 0, 0.59444],
      "75": [0, 0.68611, 0, 0, 0.90138],
      "76": [0, 0.68611, 0, 0, 0.69166],
      "77": [0, 0.68611, 0, 0, 1.09166],
      "78": [0, 0.68611, 0, 0, 0.9],
      "79": [0, 0.68611, 0, 0, 0.86388],
      "80": [0, 0.68611, 0, 0, 0.78611],
      "81": [0.19444, 0.68611, 0, 0, 0.86388],
      "82": [0, 0.68611, 0, 0, 0.8625],
      "83": [0, 0.68611, 0, 0, 0.63889],
      "84": [0, 0.68611, 0, 0, 0.8],
      "85": [0, 0.68611, 0, 0, 0.88472],
      "86": [0, 0.68611, 0.01597, 0, 0.86944],
      "87": [0, 0.68611, 0.01597, 0, 1.18888],
      "88": [0, 0.68611, 0, 0, 0.86944],
      "89": [0, 0.68611, 0.02875, 0, 0.86944],
      "90": [0, 0.68611, 0, 0, 0.70277],
      "91": [0.25, 0.75, 0, 0, 0.31944],
      "92": [0.25, 0.75, 0, 0, 0.575],
      "93": [0.25, 0.75, 0, 0, 0.31944],
      "94": [0, 0.69444, 0, 0, 0.575],
      "95": [0.31, 0.13444, 0.03194, 0, 0.575],
      "97": [0, 0.44444, 0, 0, 0.55902],
      "98": [0, 0.69444, 0, 0, 0.63889],
      "99": [0, 0.44444, 0, 0, 0.51111],
      "100": [0, 0.69444, 0, 0, 0.63889],
      "101": [0, 0.44444, 0, 0, 0.52708],
      "102": [0, 0.69444, 0.10903, 0, 0.35139],
      "103": [0.19444, 0.44444, 0.01597, 0, 0.575],
      "104": [0, 0.69444, 0, 0, 0.63889],
      "105": [0, 0.69444, 0, 0, 0.31944],
      "106": [0.19444, 0.69444, 0, 0, 0.35139],
      "107": [0, 0.69444, 0, 0, 0.60694],
      "108": [0, 0.69444, 0, 0, 0.31944],
      "109": [0, 0.44444, 0, 0, 0.95833],
      "110": [0, 0.44444, 0, 0, 0.63889],
      "111": [0, 0.44444, 0, 0, 0.575],
      "112": [0.19444, 0.44444, 0, 0, 0.63889],
      "113": [0.19444, 0.44444, 0, 0, 0.60694],
      "114": [0, 0.44444, 0, 0, 0.47361],
      "115": [0, 0.44444, 0, 0, 0.45361],
      "116": [0, 0.63492, 0, 0, 0.44722],
      "117": [0, 0.44444, 0, 0, 0.63889],
      "118": [0, 0.44444, 0.01597, 0, 0.60694],
      "119": [0, 0.44444, 0.01597, 0, 0.83055],
      "120": [0, 0.44444, 0, 0, 0.60694],
      "121": [0.19444, 0.44444, 0.01597, 0, 0.60694],
      "122": [0, 0.44444, 0, 0, 0.51111],
      "123": [0.25, 0.75, 0, 0, 0.575],
      "124": [0.25, 0.75, 0, 0, 0.31944],
      "125": [0.25, 0.75, 0, 0, 0.575],
      "126": [0.35, 0.34444, 0, 0, 0.575],
      "160": [0, 0, 0, 0, 0.25],
      "163": [0, 0.69444, 0, 0, 0.86853],
      "168": [0, 0.69444, 0, 0, 0.575],
      "172": [0, 0.44444, 0, 0, 0.76666],
      "176": [0, 0.69444, 0, 0, 0.86944],
      "177": [0.13333, 0.63333, 0, 0, 0.89444],
      "184": [0.17014, 0, 0, 0, 0.51111],
      "198": [0, 0.68611, 0, 0, 1.04166],
      "215": [0.13333, 0.63333, 0, 0, 0.89444],
      "216": [0.04861, 0.73472, 0, 0, 0.89444],
      "223": [0, 0.69444, 0, 0, 0.59722],
      "230": [0, 0.44444, 0, 0, 0.83055],
      "247": [0.13333, 0.63333, 0, 0, 0.89444],
      "248": [0.09722, 0.54167, 0, 0, 0.575],
      "305": [0, 0.44444, 0, 0, 0.31944],
      "338": [0, 0.68611, 0, 0, 1.16944],
      "339": [0, 0.44444, 0, 0, 0.89444],
      "567": [0.19444, 0.44444, 0, 0, 0.35139],
      "710": [0, 0.69444, 0, 0, 0.575],
      "711": [0, 0.63194, 0, 0, 0.575],
      "713": [0, 0.59611, 0, 0, 0.575],
      "714": [0, 0.69444, 0, 0, 0.575],
      "715": [0, 0.69444, 0, 0, 0.575],
      "728": [0, 0.69444, 0, 0, 0.575],
      "729": [0, 0.69444, 0, 0, 0.31944],
      "730": [0, 0.69444, 0, 0, 0.86944],
      "732": [0, 0.69444, 0, 0, 0.575],
      "733": [0, 0.69444, 0, 0, 0.575],
      "915": [0, 0.68611, 0, 0, 0.69166],
      "916": [0, 0.68611, 0, 0, 0.95833],
      "920": [0, 0.68611, 0, 0, 0.89444],
      "923": [0, 0.68611, 0, 0, 0.80555],
      "926": [0, 0.68611, 0, 0, 0.76666],
      "928": [0, 0.68611, 0, 0, 0.9],
      "931": [0, 0.68611, 0, 0, 0.83055],
      "933": [0, 0.68611, 0, 0, 0.89444],
      "934": [0, 0.68611, 0, 0, 0.83055],
      "936": [0, 0.68611, 0, 0, 0.89444],
      "937": [0, 0.68611, 0, 0, 0.83055],
      "8211": [0, 0.44444, 0.03194, 0, 0.575],
      "8212": [0, 0.44444, 0.03194, 0, 1.14999],
      "8216": [0, 0.69444, 0, 0, 0.31944],
      "8217": [0, 0.69444, 0, 0, 0.31944],
      "8220": [0, 0.69444, 0, 0, 0.60278],
      "8221": [0, 0.69444, 0, 0, 0.60278],
      "8224": [0.19444, 0.69444, 0, 0, 0.51111],
      "8225": [0.19444, 0.69444, 0, 0, 0.51111],
      "8242": [0, 0.55556, 0, 0, 0.34444],
      "8407": [0, 0.72444, 0.15486, 0, 0.575],
      "8463": [0, 0.69444, 0, 0, 0.66759],
      "8465": [0, 0.69444, 0, 0, 0.83055],
      "8467": [0, 0.69444, 0, 0, 0.47361],
      "8472": [0.19444, 0.44444, 0, 0, 0.74027],
      "8476": [0, 0.69444, 0, 0, 0.83055],
      "8501": [0, 0.69444, 0, 0, 0.70277],
      "8592": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8593": [0.19444, 0.69444, 0, 0, 0.575],
      "8594": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8595": [0.19444, 0.69444, 0, 0, 0.575],
      "8596": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8597": [0.25, 0.75, 0, 0, 0.575],
      "8598": [0.19444, 0.69444, 0, 0, 1.14999],
      "8599": [0.19444, 0.69444, 0, 0, 1.14999],
      "8600": [0.19444, 0.69444, 0, 0, 1.14999],
      "8601": [0.19444, 0.69444, 0, 0, 1.14999],
      "8636": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8637": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8640": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8641": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8656": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8657": [0.19444, 0.69444, 0, 0, 0.70277],
      "8658": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8659": [0.19444, 0.69444, 0, 0, 0.70277],
      "8660": [-0.10889, 0.39111, 0, 0, 1.14999],
      "8661": [0.25, 0.75, 0, 0, 0.70277],
      "8704": [0, 0.69444, 0, 0, 0.63889],
      "8706": [0, 0.69444, 0.06389, 0, 0.62847],
      "8707": [0, 0.69444, 0, 0, 0.63889],
      "8709": [0.05556, 0.75, 0, 0, 0.575],
      "8711": [0, 0.68611, 0, 0, 0.95833],
      "8712": [0.08556, 0.58556, 0, 0, 0.76666],
      "8715": [0.08556, 0.58556, 0, 0, 0.76666],
      "8722": [0.13333, 0.63333, 0, 0, 0.89444],
      "8723": [0.13333, 0.63333, 0, 0, 0.89444],
      "8725": [0.25, 0.75, 0, 0, 0.575],
      "8726": [0.25, 0.75, 0, 0, 0.575],
      "8727": [-0.02778, 0.47222, 0, 0, 0.575],
      "8728": [-0.02639, 0.47361, 0, 0, 0.575],
      "8729": [-0.02639, 0.47361, 0, 0, 0.575],
      "8730": [0.18, 0.82, 0, 0, 0.95833],
      "8733": [0, 0.44444, 0, 0, 0.89444],
      "8734": [0, 0.44444, 0, 0, 1.14999],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8739": [0.25, 0.75, 0, 0, 0.31944],
      "8741": [0.25, 0.75, 0, 0, 0.575],
      "8743": [0, 0.55556, 0, 0, 0.76666],
      "8744": [0, 0.55556, 0, 0, 0.76666],
      "8745": [0, 0.55556, 0, 0, 0.76666],
      "8746": [0, 0.55556, 0, 0, 0.76666],
      "8747": [0.19444, 0.69444, 0.12778, 0, 0.56875],
      "8764": [-0.10889, 0.39111, 0, 0, 0.89444],
      "8768": [0.19444, 0.69444, 0, 0, 0.31944],
      "8771": [222e-5, 0.50222, 0, 0, 0.89444],
      "8773": [0.027, 0.638, 0, 0, 0.894],
      "8776": [0.02444, 0.52444, 0, 0, 0.89444],
      "8781": [222e-5, 0.50222, 0, 0, 0.89444],
      "8801": [222e-5, 0.50222, 0, 0, 0.89444],
      "8804": [0.19667, 0.69667, 0, 0, 0.89444],
      "8805": [0.19667, 0.69667, 0, 0, 0.89444],
      "8810": [0.08556, 0.58556, 0, 0, 1.14999],
      "8811": [0.08556, 0.58556, 0, 0, 1.14999],
      "8826": [0.08556, 0.58556, 0, 0, 0.89444],
      "8827": [0.08556, 0.58556, 0, 0, 0.89444],
      "8834": [0.08556, 0.58556, 0, 0, 0.89444],
      "8835": [0.08556, 0.58556, 0, 0, 0.89444],
      "8838": [0.19667, 0.69667, 0, 0, 0.89444],
      "8839": [0.19667, 0.69667, 0, 0, 0.89444],
      "8846": [0, 0.55556, 0, 0, 0.76666],
      "8849": [0.19667, 0.69667, 0, 0, 0.89444],
      "8850": [0.19667, 0.69667, 0, 0, 0.89444],
      "8851": [0, 0.55556, 0, 0, 0.76666],
      "8852": [0, 0.55556, 0, 0, 0.76666],
      "8853": [0.13333, 0.63333, 0, 0, 0.89444],
      "8854": [0.13333, 0.63333, 0, 0, 0.89444],
      "8855": [0.13333, 0.63333, 0, 0, 0.89444],
      "8856": [0.13333, 0.63333, 0, 0, 0.89444],
      "8857": [0.13333, 0.63333, 0, 0, 0.89444],
      "8866": [0, 0.69444, 0, 0, 0.70277],
      "8867": [0, 0.69444, 0, 0, 0.70277],
      "8868": [0, 0.69444, 0, 0, 0.89444],
      "8869": [0, 0.69444, 0, 0, 0.89444],
      "8900": [-0.02639, 0.47361, 0, 0, 0.575],
      "8901": [-0.02639, 0.47361, 0, 0, 0.31944],
      "8902": [-0.02778, 0.47222, 0, 0, 0.575],
      "8968": [0.25, 0.75, 0, 0, 0.51111],
      "8969": [0.25, 0.75, 0, 0, 0.51111],
      "8970": [0.25, 0.75, 0, 0, 0.51111],
      "8971": [0.25, 0.75, 0, 0, 0.51111],
      "8994": [-0.13889, 0.36111, 0, 0, 1.14999],
      "8995": [-0.13889, 0.36111, 0, 0, 1.14999],
      "9651": [0.19444, 0.69444, 0, 0, 1.02222],
      "9657": [-0.02778, 0.47222, 0, 0, 0.575],
      "9661": [0.19444, 0.69444, 0, 0, 1.02222],
      "9667": [-0.02778, 0.47222, 0, 0, 0.575],
      "9711": [0.19444, 0.69444, 0, 0, 1.14999],
      "9824": [0.12963, 0.69444, 0, 0, 0.89444],
      "9825": [0.12963, 0.69444, 0, 0, 0.89444],
      "9826": [0.12963, 0.69444, 0, 0, 0.89444],
      "9827": [0.12963, 0.69444, 0, 0, 0.89444],
      "9837": [0, 0.75, 0, 0, 0.44722],
      "9838": [0.19444, 0.69444, 0, 0, 0.44722],
      "9839": [0.19444, 0.69444, 0, 0, 0.44722],
      "10216": [0.25, 0.75, 0, 0, 0.44722],
      "10217": [0.25, 0.75, 0, 0, 0.44722],
      "10815": [0, 0.68611, 0, 0, 0.9],
      "10927": [0.19667, 0.69667, 0, 0, 0.89444],
      "10928": [0.19667, 0.69667, 0, 0, 0.89444],
      "57376": [0.19444, 0.69444, 0, 0, 0]
    },
    "Main-BoldItalic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.11417, 0, 0.38611],
      "34": [0, 0.69444, 0.07939, 0, 0.62055],
      "35": [0.19444, 0.69444, 0.06833, 0, 0.94444],
      "37": [0.05556, 0.75, 0.12861, 0, 0.94444],
      "38": [0, 0.69444, 0.08528, 0, 0.88555],
      "39": [0, 0.69444, 0.12945, 0, 0.35555],
      "40": [0.25, 0.75, 0.15806, 0, 0.47333],
      "41": [0.25, 0.75, 0.03306, 0, 0.47333],
      "42": [0, 0.75, 0.14333, 0, 0.59111],
      "43": [0.10333, 0.60333, 0.03306, 0, 0.88555],
      "44": [0.19444, 0.14722, 0, 0, 0.35555],
      "45": [0, 0.44444, 0.02611, 0, 0.41444],
      "46": [0, 0.14722, 0, 0, 0.35555],
      "47": [0.25, 0.75, 0.15806, 0, 0.59111],
      "48": [0, 0.64444, 0.13167, 0, 0.59111],
      "49": [0, 0.64444, 0.13167, 0, 0.59111],
      "50": [0, 0.64444, 0.13167, 0, 0.59111],
      "51": [0, 0.64444, 0.13167, 0, 0.59111],
      "52": [0.19444, 0.64444, 0.13167, 0, 0.59111],
      "53": [0, 0.64444, 0.13167, 0, 0.59111],
      "54": [0, 0.64444, 0.13167, 0, 0.59111],
      "55": [0.19444, 0.64444, 0.13167, 0, 0.59111],
      "56": [0, 0.64444, 0.13167, 0, 0.59111],
      "57": [0, 0.64444, 0.13167, 0, 0.59111],
      "58": [0, 0.44444, 0.06695, 0, 0.35555],
      "59": [0.19444, 0.44444, 0.06695, 0, 0.35555],
      "61": [-0.10889, 0.39111, 0.06833, 0, 0.88555],
      "63": [0, 0.69444, 0.11472, 0, 0.59111],
      "64": [0, 0.69444, 0.09208, 0, 0.88555],
      "65": [0, 0.68611, 0, 0, 0.86555],
      "66": [0, 0.68611, 0.0992, 0, 0.81666],
      "67": [0, 0.68611, 0.14208, 0, 0.82666],
      "68": [0, 0.68611, 0.09062, 0, 0.87555],
      "69": [0, 0.68611, 0.11431, 0, 0.75666],
      "70": [0, 0.68611, 0.12903, 0, 0.72722],
      "71": [0, 0.68611, 0.07347, 0, 0.89527],
      "72": [0, 0.68611, 0.17208, 0, 0.8961],
      "73": [0, 0.68611, 0.15681, 0, 0.47166],
      "74": [0, 0.68611, 0.145, 0, 0.61055],
      "75": [0, 0.68611, 0.14208, 0, 0.89499],
      "76": [0, 0.68611, 0, 0, 0.69777],
      "77": [0, 0.68611, 0.17208, 0, 1.07277],
      "78": [0, 0.68611, 0.17208, 0, 0.8961],
      "79": [0, 0.68611, 0.09062, 0, 0.85499],
      "80": [0, 0.68611, 0.0992, 0, 0.78721],
      "81": [0.19444, 0.68611, 0.09062, 0, 0.85499],
      "82": [0, 0.68611, 0.02559, 0, 0.85944],
      "83": [0, 0.68611, 0.11264, 0, 0.64999],
      "84": [0, 0.68611, 0.12903, 0, 0.7961],
      "85": [0, 0.68611, 0.17208, 0, 0.88083],
      "86": [0, 0.68611, 0.18625, 0, 0.86555],
      "87": [0, 0.68611, 0.18625, 0, 1.15999],
      "88": [0, 0.68611, 0.15681, 0, 0.86555],
      "89": [0, 0.68611, 0.19803, 0, 0.86555],
      "90": [0, 0.68611, 0.14208, 0, 0.70888],
      "91": [0.25, 0.75, 0.1875, 0, 0.35611],
      "93": [0.25, 0.75, 0.09972, 0, 0.35611],
      "94": [0, 0.69444, 0.06709, 0, 0.59111],
      "95": [0.31, 0.13444, 0.09811, 0, 0.59111],
      "97": [0, 0.44444, 0.09426, 0, 0.59111],
      "98": [0, 0.69444, 0.07861, 0, 0.53222],
      "99": [0, 0.44444, 0.05222, 0, 0.53222],
      "100": [0, 0.69444, 0.10861, 0, 0.59111],
      "101": [0, 0.44444, 0.085, 0, 0.53222],
      "102": [0.19444, 0.69444, 0.21778, 0, 0.4],
      "103": [0.19444, 0.44444, 0.105, 0, 0.53222],
      "104": [0, 0.69444, 0.09426, 0, 0.59111],
      "105": [0, 0.69326, 0.11387, 0, 0.35555],
      "106": [0.19444, 0.69326, 0.1672, 0, 0.35555],
      "107": [0, 0.69444, 0.11111, 0, 0.53222],
      "108": [0, 0.69444, 0.10861, 0, 0.29666],
      "109": [0, 0.44444, 0.09426, 0, 0.94444],
      "110": [0, 0.44444, 0.09426, 0, 0.64999],
      "111": [0, 0.44444, 0.07861, 0, 0.59111],
      "112": [0.19444, 0.44444, 0.07861, 0, 0.59111],
      "113": [0.19444, 0.44444, 0.105, 0, 0.53222],
      "114": [0, 0.44444, 0.11111, 0, 0.50167],
      "115": [0, 0.44444, 0.08167, 0, 0.48694],
      "116": [0, 0.63492, 0.09639, 0, 0.385],
      "117": [0, 0.44444, 0.09426, 0, 0.62055],
      "118": [0, 0.44444, 0.11111, 0, 0.53222],
      "119": [0, 0.44444, 0.11111, 0, 0.76777],
      "120": [0, 0.44444, 0.12583, 0, 0.56055],
      "121": [0.19444, 0.44444, 0.105, 0, 0.56166],
      "122": [0, 0.44444, 0.13889, 0, 0.49055],
      "126": [0.35, 0.34444, 0.11472, 0, 0.59111],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.69444, 0.11473, 0, 0.59111],
      "176": [0, 0.69444, 0, 0, 0.94888],
      "184": [0.17014, 0, 0, 0, 0.53222],
      "198": [0, 0.68611, 0.11431, 0, 1.02277],
      "216": [0.04861, 0.73472, 0.09062, 0, 0.88555],
      "223": [0.19444, 0.69444, 0.09736, 0, 0.665],
      "230": [0, 0.44444, 0.085, 0, 0.82666],
      "248": [0.09722, 0.54167, 0.09458, 0, 0.59111],
      "305": [0, 0.44444, 0.09426, 0, 0.35555],
      "338": [0, 0.68611, 0.11431, 0, 1.14054],
      "339": [0, 0.44444, 0.085, 0, 0.82666],
      "567": [0.19444, 0.44444, 0.04611, 0, 0.385],
      "710": [0, 0.69444, 0.06709, 0, 0.59111],
      "711": [0, 0.63194, 0.08271, 0, 0.59111],
      "713": [0, 0.59444, 0.10444, 0, 0.59111],
      "714": [0, 0.69444, 0.08528, 0, 0.59111],
      "715": [0, 0.69444, 0, 0, 0.59111],
      "728": [0, 0.69444, 0.10333, 0, 0.59111],
      "729": [0, 0.69444, 0.12945, 0, 0.35555],
      "730": [0, 0.69444, 0, 0, 0.94888],
      "732": [0, 0.69444, 0.11472, 0, 0.59111],
      "733": [0, 0.69444, 0.11472, 0, 0.59111],
      "915": [0, 0.68611, 0.12903, 0, 0.69777],
      "916": [0, 0.68611, 0, 0, 0.94444],
      "920": [0, 0.68611, 0.09062, 0, 0.88555],
      "923": [0, 0.68611, 0, 0, 0.80666],
      "926": [0, 0.68611, 0.15092, 0, 0.76777],
      "928": [0, 0.68611, 0.17208, 0, 0.8961],
      "931": [0, 0.68611, 0.11431, 0, 0.82666],
      "933": [0, 0.68611, 0.10778, 0, 0.88555],
      "934": [0, 0.68611, 0.05632, 0, 0.82666],
      "936": [0, 0.68611, 0.10778, 0, 0.88555],
      "937": [0, 0.68611, 0.0992, 0, 0.82666],
      "8211": [0, 0.44444, 0.09811, 0, 0.59111],
      "8212": [0, 0.44444, 0.09811, 0, 1.18221],
      "8216": [0, 0.69444, 0.12945, 0, 0.35555],
      "8217": [0, 0.69444, 0.12945, 0, 0.35555],
      "8220": [0, 0.69444, 0.16772, 0, 0.62055],
      "8221": [0, 0.69444, 0.07939, 0, 0.62055]
    },
    "Main-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.12417, 0, 0.30667],
      "34": [0, 0.69444, 0.06961, 0, 0.51444],
      "35": [0.19444, 0.69444, 0.06616, 0, 0.81777],
      "37": [0.05556, 0.75, 0.13639, 0, 0.81777],
      "38": [0, 0.69444, 0.09694, 0, 0.76666],
      "39": [0, 0.69444, 0.12417, 0, 0.30667],
      "40": [0.25, 0.75, 0.16194, 0, 0.40889],
      "41": [0.25, 0.75, 0.03694, 0, 0.40889],
      "42": [0, 0.75, 0.14917, 0, 0.51111],
      "43": [0.05667, 0.56167, 0.03694, 0, 0.76666],
      "44": [0.19444, 0.10556, 0, 0, 0.30667],
      "45": [0, 0.43056, 0.02826, 0, 0.35778],
      "46": [0, 0.10556, 0, 0, 0.30667],
      "47": [0.25, 0.75, 0.16194, 0, 0.51111],
      "48": [0, 0.64444, 0.13556, 0, 0.51111],
      "49": [0, 0.64444, 0.13556, 0, 0.51111],
      "50": [0, 0.64444, 0.13556, 0, 0.51111],
      "51": [0, 0.64444, 0.13556, 0, 0.51111],
      "52": [0.19444, 0.64444, 0.13556, 0, 0.51111],
      "53": [0, 0.64444, 0.13556, 0, 0.51111],
      "54": [0, 0.64444, 0.13556, 0, 0.51111],
      "55": [0.19444, 0.64444, 0.13556, 0, 0.51111],
      "56": [0, 0.64444, 0.13556, 0, 0.51111],
      "57": [0, 0.64444, 0.13556, 0, 0.51111],
      "58": [0, 0.43056, 0.0582, 0, 0.30667],
      "59": [0.19444, 0.43056, 0.0582, 0, 0.30667],
      "61": [-0.13313, 0.36687, 0.06616, 0, 0.76666],
      "63": [0, 0.69444, 0.1225, 0, 0.51111],
      "64": [0, 0.69444, 0.09597, 0, 0.76666],
      "65": [0, 0.68333, 0, 0, 0.74333],
      "66": [0, 0.68333, 0.10257, 0, 0.70389],
      "67": [0, 0.68333, 0.14528, 0, 0.71555],
      "68": [0, 0.68333, 0.09403, 0, 0.755],
      "69": [0, 0.68333, 0.12028, 0, 0.67833],
      "70": [0, 0.68333, 0.13305, 0, 0.65277],
      "71": [0, 0.68333, 0.08722, 0, 0.77361],
      "72": [0, 0.68333, 0.16389, 0, 0.74333],
      "73": [0, 0.68333, 0.15806, 0, 0.38555],
      "74": [0, 0.68333, 0.14028, 0, 0.525],
      "75": [0, 0.68333, 0.14528, 0, 0.76888],
      "76": [0, 0.68333, 0, 0, 0.62722],
      "77": [0, 0.68333, 0.16389, 0, 0.89666],
      "78": [0, 0.68333, 0.16389, 0, 0.74333],
      "79": [0, 0.68333, 0.09403, 0, 0.76666],
      "80": [0, 0.68333, 0.10257, 0, 0.67833],
      "81": [0.19444, 0.68333, 0.09403, 0, 0.76666],
      "82": [0, 0.68333, 0.03868, 0, 0.72944],
      "83": [0, 0.68333, 0.11972, 0, 0.56222],
      "84": [0, 0.68333, 0.13305, 0, 0.71555],
      "85": [0, 0.68333, 0.16389, 0, 0.74333],
      "86": [0, 0.68333, 0.18361, 0, 0.74333],
      "87": [0, 0.68333, 0.18361, 0, 0.99888],
      "88": [0, 0.68333, 0.15806, 0, 0.74333],
      "89": [0, 0.68333, 0.19383, 0, 0.74333],
      "90": [0, 0.68333, 0.14528, 0, 0.61333],
      "91": [0.25, 0.75, 0.1875, 0, 0.30667],
      "93": [0.25, 0.75, 0.10528, 0, 0.30667],
      "94": [0, 0.69444, 0.06646, 0, 0.51111],
      "95": [0.31, 0.12056, 0.09208, 0, 0.51111],
      "97": [0, 0.43056, 0.07671, 0, 0.51111],
      "98": [0, 0.69444, 0.06312, 0, 0.46],
      "99": [0, 0.43056, 0.05653, 0, 0.46],
      "100": [0, 0.69444, 0.10333, 0, 0.51111],
      "101": [0, 0.43056, 0.07514, 0, 0.46],
      "102": [0.19444, 0.69444, 0.21194, 0, 0.30667],
      "103": [0.19444, 0.43056, 0.08847, 0, 0.46],
      "104": [0, 0.69444, 0.07671, 0, 0.51111],
      "105": [0, 0.65536, 0.1019, 0, 0.30667],
      "106": [0.19444, 0.65536, 0.14467, 0, 0.30667],
      "107": [0, 0.69444, 0.10764, 0, 0.46],
      "108": [0, 0.69444, 0.10333, 0, 0.25555],
      "109": [0, 0.43056, 0.07671, 0, 0.81777],
      "110": [0, 0.43056, 0.07671, 0, 0.56222],
      "111": [0, 0.43056, 0.06312, 0, 0.51111],
      "112": [0.19444, 0.43056, 0.06312, 0, 0.51111],
      "113": [0.19444, 0.43056, 0.08847, 0, 0.46],
      "114": [0, 0.43056, 0.10764, 0, 0.42166],
      "115": [0, 0.43056, 0.08208, 0, 0.40889],
      "116": [0, 0.61508, 0.09486, 0, 0.33222],
      "117": [0, 0.43056, 0.07671, 0, 0.53666],
      "118": [0, 0.43056, 0.10764, 0, 0.46],
      "119": [0, 0.43056, 0.10764, 0, 0.66444],
      "120": [0, 0.43056, 0.12042, 0, 0.46389],
      "121": [0.19444, 0.43056, 0.08847, 0, 0.48555],
      "122": [0, 0.43056, 0.12292, 0, 0.40889],
      "126": [0.35, 0.31786, 0.11585, 0, 0.51111],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.66786, 0.10474, 0, 0.51111],
      "176": [0, 0.69444, 0, 0, 0.83129],
      "184": [0.17014, 0, 0, 0, 0.46],
      "198": [0, 0.68333, 0.12028, 0, 0.88277],
      "216": [0.04861, 0.73194, 0.09403, 0, 0.76666],
      "223": [0.19444, 0.69444, 0.10514, 0, 0.53666],
      "230": [0, 0.43056, 0.07514, 0, 0.71555],
      "248": [0.09722, 0.52778, 0.09194, 0, 0.51111],
      "338": [0, 0.68333, 0.12028, 0, 0.98499],
      "339": [0, 0.43056, 0.07514, 0, 0.71555],
      "710": [0, 0.69444, 0.06646, 0, 0.51111],
      "711": [0, 0.62847, 0.08295, 0, 0.51111],
      "713": [0, 0.56167, 0.10333, 0, 0.51111],
      "714": [0, 0.69444, 0.09694, 0, 0.51111],
      "715": [0, 0.69444, 0, 0, 0.51111],
      "728": [0, 0.69444, 0.10806, 0, 0.51111],
      "729": [0, 0.66786, 0.11752, 0, 0.30667],
      "730": [0, 0.69444, 0, 0, 0.83129],
      "732": [0, 0.66786, 0.11585, 0, 0.51111],
      "733": [0, 0.69444, 0.1225, 0, 0.51111],
      "915": [0, 0.68333, 0.13305, 0, 0.62722],
      "916": [0, 0.68333, 0, 0, 0.81777],
      "920": [0, 0.68333, 0.09403, 0, 0.76666],
      "923": [0, 0.68333, 0, 0, 0.69222],
      "926": [0, 0.68333, 0.15294, 0, 0.66444],
      "928": [0, 0.68333, 0.16389, 0, 0.74333],
      "931": [0, 0.68333, 0.12028, 0, 0.71555],
      "933": [0, 0.68333, 0.11111, 0, 0.76666],
      "934": [0, 0.68333, 0.05986, 0, 0.71555],
      "936": [0, 0.68333, 0.11111, 0, 0.76666],
      "937": [0, 0.68333, 0.10257, 0, 0.71555],
      "8211": [0, 0.43056, 0.09208, 0, 0.51111],
      "8212": [0, 0.43056, 0.09208, 0, 1.02222],
      "8216": [0, 0.69444, 0.12417, 0, 0.30667],
      "8217": [0, 0.69444, 0.12417, 0, 0.30667],
      "8220": [0, 0.69444, 0.1685, 0, 0.51444],
      "8221": [0, 0.69444, 0.06961, 0, 0.51444],
      "8463": [0, 0.68889, 0, 0, 0.54028]
    },
    "Main-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.27778],
      "34": [0, 0.69444, 0, 0, 0.5],
      "35": [0.19444, 0.69444, 0, 0, 0.83334],
      "36": [0.05556, 0.75, 0, 0, 0.5],
      "37": [0.05556, 0.75, 0, 0, 0.83334],
      "38": [0, 0.69444, 0, 0, 0.77778],
      "39": [0, 0.69444, 0, 0, 0.27778],
      "40": [0.25, 0.75, 0, 0, 0.38889],
      "41": [0.25, 0.75, 0, 0, 0.38889],
      "42": [0, 0.75, 0, 0, 0.5],
      "43": [0.08333, 0.58333, 0, 0, 0.77778],
      "44": [0.19444, 0.10556, 0, 0, 0.27778],
      "45": [0, 0.43056, 0, 0, 0.33333],
      "46": [0, 0.10556, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0, 0, 0.5],
      "48": [0, 0.64444, 0, 0, 0.5],
      "49": [0, 0.64444, 0, 0, 0.5],
      "50": [0, 0.64444, 0, 0, 0.5],
      "51": [0, 0.64444, 0, 0, 0.5],
      "52": [0, 0.64444, 0, 0, 0.5],
      "53": [0, 0.64444, 0, 0, 0.5],
      "54": [0, 0.64444, 0, 0, 0.5],
      "55": [0, 0.64444, 0, 0, 0.5],
      "56": [0, 0.64444, 0, 0, 0.5],
      "57": [0, 0.64444, 0, 0, 0.5],
      "58": [0, 0.43056, 0, 0, 0.27778],
      "59": [0.19444, 0.43056, 0, 0, 0.27778],
      "60": [0.0391, 0.5391, 0, 0, 0.77778],
      "61": [-0.13313, 0.36687, 0, 0, 0.77778],
      "62": [0.0391, 0.5391, 0, 0, 0.77778],
      "63": [0, 0.69444, 0, 0, 0.47222],
      "64": [0, 0.69444, 0, 0, 0.77778],
      "65": [0, 0.68333, 0, 0, 0.75],
      "66": [0, 0.68333, 0, 0, 0.70834],
      "67": [0, 0.68333, 0, 0, 0.72222],
      "68": [0, 0.68333, 0, 0, 0.76389],
      "69": [0, 0.68333, 0, 0, 0.68056],
      "70": [0, 0.68333, 0, 0, 0.65278],
      "71": [0, 0.68333, 0, 0, 0.78472],
      "72": [0, 0.68333, 0, 0, 0.75],
      "73": [0, 0.68333, 0, 0, 0.36111],
      "74": [0, 0.68333, 0, 0, 0.51389],
      "75": [0, 0.68333, 0, 0, 0.77778],
      "76": [0, 0.68333, 0, 0, 0.625],
      "77": [0, 0.68333, 0, 0, 0.91667],
      "78": [0, 0.68333, 0, 0, 0.75],
      "79": [0, 0.68333, 0, 0, 0.77778],
      "80": [0, 0.68333, 0, 0, 0.68056],
      "81": [0.19444, 0.68333, 0, 0, 0.77778],
      "82": [0, 0.68333, 0, 0, 0.73611],
      "83": [0, 0.68333, 0, 0, 0.55556],
      "84": [0, 0.68333, 0, 0, 0.72222],
      "85": [0, 0.68333, 0, 0, 0.75],
      "86": [0, 0.68333, 0.01389, 0, 0.75],
      "87": [0, 0.68333, 0.01389, 0, 1.02778],
      "88": [0, 0.68333, 0, 0, 0.75],
      "89": [0, 0.68333, 0.025, 0, 0.75],
      "90": [0, 0.68333, 0, 0, 0.61111],
      "91": [0.25, 0.75, 0, 0, 0.27778],
      "92": [0.25, 0.75, 0, 0, 0.5],
      "93": [0.25, 0.75, 0, 0, 0.27778],
      "94": [0, 0.69444, 0, 0, 0.5],
      "95": [0.31, 0.12056, 0.02778, 0, 0.5],
      "97": [0, 0.43056, 0, 0, 0.5],
      "98": [0, 0.69444, 0, 0, 0.55556],
      "99": [0, 0.43056, 0, 0, 0.44445],
      "100": [0, 0.69444, 0, 0, 0.55556],
      "101": [0, 0.43056, 0, 0, 0.44445],
      "102": [0, 0.69444, 0.07778, 0, 0.30556],
      "103": [0.19444, 0.43056, 0.01389, 0, 0.5],
      "104": [0, 0.69444, 0, 0, 0.55556],
      "105": [0, 0.66786, 0, 0, 0.27778],
      "106": [0.19444, 0.66786, 0, 0, 0.30556],
      "107": [0, 0.69444, 0, 0, 0.52778],
      "108": [0, 0.69444, 0, 0, 0.27778],
      "109": [0, 0.43056, 0, 0, 0.83334],
      "110": [0, 0.43056, 0, 0, 0.55556],
      "111": [0, 0.43056, 0, 0, 0.5],
      "112": [0.19444, 0.43056, 0, 0, 0.55556],
      "113": [0.19444, 0.43056, 0, 0, 0.52778],
      "114": [0, 0.43056, 0, 0, 0.39167],
      "115": [0, 0.43056, 0, 0, 0.39445],
      "116": [0, 0.61508, 0, 0, 0.38889],
      "117": [0, 0.43056, 0, 0, 0.55556],
      "118": [0, 0.43056, 0.01389, 0, 0.52778],
      "119": [0, 0.43056, 0.01389, 0, 0.72222],
      "120": [0, 0.43056, 0, 0, 0.52778],
      "121": [0.19444, 0.43056, 0.01389, 0, 0.52778],
      "122": [0, 0.43056, 0, 0, 0.44445],
      "123": [0.25, 0.75, 0, 0, 0.5],
      "124": [0.25, 0.75, 0, 0, 0.27778],
      "125": [0.25, 0.75, 0, 0, 0.5],
      "126": [0.35, 0.31786, 0, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "163": [0, 0.69444, 0, 0, 0.76909],
      "167": [0.19444, 0.69444, 0, 0, 0.44445],
      "168": [0, 0.66786, 0, 0, 0.5],
      "172": [0, 0.43056, 0, 0, 0.66667],
      "176": [0, 0.69444, 0, 0, 0.75],
      "177": [0.08333, 0.58333, 0, 0, 0.77778],
      "182": [0.19444, 0.69444, 0, 0, 0.61111],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "198": [0, 0.68333, 0, 0, 0.90278],
      "215": [0.08333, 0.58333, 0, 0, 0.77778],
      "216": [0.04861, 0.73194, 0, 0, 0.77778],
      "223": [0, 0.69444, 0, 0, 0.5],
      "230": [0, 0.43056, 0, 0, 0.72222],
      "247": [0.08333, 0.58333, 0, 0, 0.77778],
      "248": [0.09722, 0.52778, 0, 0, 0.5],
      "305": [0, 0.43056, 0, 0, 0.27778],
      "338": [0, 0.68333, 0, 0, 1.01389],
      "339": [0, 0.43056, 0, 0, 0.77778],
      "567": [0.19444, 0.43056, 0, 0, 0.30556],
      "710": [0, 0.69444, 0, 0, 0.5],
      "711": [0, 0.62847, 0, 0, 0.5],
      "713": [0, 0.56778, 0, 0, 0.5],
      "714": [0, 0.69444, 0, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0, 0, 0.5],
      "729": [0, 0.66786, 0, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.75],
      "732": [0, 0.66786, 0, 0, 0.5],
      "733": [0, 0.69444, 0, 0, 0.5],
      "915": [0, 0.68333, 0, 0, 0.625],
      "916": [0, 0.68333, 0, 0, 0.83334],
      "920": [0, 0.68333, 0, 0, 0.77778],
      "923": [0, 0.68333, 0, 0, 0.69445],
      "926": [0, 0.68333, 0, 0, 0.66667],
      "928": [0, 0.68333, 0, 0, 0.75],
      "931": [0, 0.68333, 0, 0, 0.72222],
      "933": [0, 0.68333, 0, 0, 0.77778],
      "934": [0, 0.68333, 0, 0, 0.72222],
      "936": [0, 0.68333, 0, 0, 0.77778],
      "937": [0, 0.68333, 0, 0, 0.72222],
      "8211": [0, 0.43056, 0.02778, 0, 0.5],
      "8212": [0, 0.43056, 0.02778, 0, 1],
      "8216": [0, 0.69444, 0, 0, 0.27778],
      "8217": [0, 0.69444, 0, 0, 0.27778],
      "8220": [0, 0.69444, 0, 0, 0.5],
      "8221": [0, 0.69444, 0, 0, 0.5],
      "8224": [0.19444, 0.69444, 0, 0, 0.44445],
      "8225": [0.19444, 0.69444, 0, 0, 0.44445],
      "8230": [0, 0.123, 0, 0, 1.172],
      "8242": [0, 0.55556, 0, 0, 0.275],
      "8407": [0, 0.71444, 0.15382, 0, 0.5],
      "8463": [0, 0.68889, 0, 0, 0.54028],
      "8465": [0, 0.69444, 0, 0, 0.72222],
      "8467": [0, 0.69444, 0, 0.11111, 0.41667],
      "8472": [0.19444, 0.43056, 0, 0.11111, 0.63646],
      "8476": [0, 0.69444, 0, 0, 0.72222],
      "8501": [0, 0.69444, 0, 0, 0.61111],
      "8592": [-0.13313, 0.36687, 0, 0, 1],
      "8593": [0.19444, 0.69444, 0, 0, 0.5],
      "8594": [-0.13313, 0.36687, 0, 0, 1],
      "8595": [0.19444, 0.69444, 0, 0, 0.5],
      "8596": [-0.13313, 0.36687, 0, 0, 1],
      "8597": [0.25, 0.75, 0, 0, 0.5],
      "8598": [0.19444, 0.69444, 0, 0, 1],
      "8599": [0.19444, 0.69444, 0, 0, 1],
      "8600": [0.19444, 0.69444, 0, 0, 1],
      "8601": [0.19444, 0.69444, 0, 0, 1],
      "8614": [0.011, 0.511, 0, 0, 1],
      "8617": [0.011, 0.511, 0, 0, 1.126],
      "8618": [0.011, 0.511, 0, 0, 1.126],
      "8636": [-0.13313, 0.36687, 0, 0, 1],
      "8637": [-0.13313, 0.36687, 0, 0, 1],
      "8640": [-0.13313, 0.36687, 0, 0, 1],
      "8641": [-0.13313, 0.36687, 0, 0, 1],
      "8652": [0.011, 0.671, 0, 0, 1],
      "8656": [-0.13313, 0.36687, 0, 0, 1],
      "8657": [0.19444, 0.69444, 0, 0, 0.61111],
      "8658": [-0.13313, 0.36687, 0, 0, 1],
      "8659": [0.19444, 0.69444, 0, 0, 0.61111],
      "8660": [-0.13313, 0.36687, 0, 0, 1],
      "8661": [0.25, 0.75, 0, 0, 0.61111],
      "8704": [0, 0.69444, 0, 0, 0.55556],
      "8706": [0, 0.69444, 0.05556, 0.08334, 0.5309],
      "8707": [0, 0.69444, 0, 0, 0.55556],
      "8709": [0.05556, 0.75, 0, 0, 0.5],
      "8711": [0, 0.68333, 0, 0, 0.83334],
      "8712": [0.0391, 0.5391, 0, 0, 0.66667],
      "8715": [0.0391, 0.5391, 0, 0, 0.66667],
      "8722": [0.08333, 0.58333, 0, 0, 0.77778],
      "8723": [0.08333, 0.58333, 0, 0, 0.77778],
      "8725": [0.25, 0.75, 0, 0, 0.5],
      "8726": [0.25, 0.75, 0, 0, 0.5],
      "8727": [-0.03472, 0.46528, 0, 0, 0.5],
      "8728": [-0.05555, 0.44445, 0, 0, 0.5],
      "8729": [-0.05555, 0.44445, 0, 0, 0.5],
      "8730": [0.2, 0.8, 0, 0, 0.83334],
      "8733": [0, 0.43056, 0, 0, 0.77778],
      "8734": [0, 0.43056, 0, 0, 1],
      "8736": [0, 0.69224, 0, 0, 0.72222],
      "8739": [0.25, 0.75, 0, 0, 0.27778],
      "8741": [0.25, 0.75, 0, 0, 0.5],
      "8743": [0, 0.55556, 0, 0, 0.66667],
      "8744": [0, 0.55556, 0, 0, 0.66667],
      "8745": [0, 0.55556, 0, 0, 0.66667],
      "8746": [0, 0.55556, 0, 0, 0.66667],
      "8747": [0.19444, 0.69444, 0.11111, 0, 0.41667],
      "8764": [-0.13313, 0.36687, 0, 0, 0.77778],
      "8768": [0.19444, 0.69444, 0, 0, 0.27778],
      "8771": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8773": [-0.022, 0.589, 0, 0, 0.778],
      "8776": [-0.01688, 0.48312, 0, 0, 0.77778],
      "8781": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8784": [-0.133, 0.673, 0, 0, 0.778],
      "8801": [-0.03625, 0.46375, 0, 0, 0.77778],
      "8804": [0.13597, 0.63597, 0, 0, 0.77778],
      "8805": [0.13597, 0.63597, 0, 0, 0.77778],
      "8810": [0.0391, 0.5391, 0, 0, 1],
      "8811": [0.0391, 0.5391, 0, 0, 1],
      "8826": [0.0391, 0.5391, 0, 0, 0.77778],
      "8827": [0.0391, 0.5391, 0, 0, 0.77778],
      "8834": [0.0391, 0.5391, 0, 0, 0.77778],
      "8835": [0.0391, 0.5391, 0, 0, 0.77778],
      "8838": [0.13597, 0.63597, 0, 0, 0.77778],
      "8839": [0.13597, 0.63597, 0, 0, 0.77778],
      "8846": [0, 0.55556, 0, 0, 0.66667],
      "8849": [0.13597, 0.63597, 0, 0, 0.77778],
      "8850": [0.13597, 0.63597, 0, 0, 0.77778],
      "8851": [0, 0.55556, 0, 0, 0.66667],
      "8852": [0, 0.55556, 0, 0, 0.66667],
      "8853": [0.08333, 0.58333, 0, 0, 0.77778],
      "8854": [0.08333, 0.58333, 0, 0, 0.77778],
      "8855": [0.08333, 0.58333, 0, 0, 0.77778],
      "8856": [0.08333, 0.58333, 0, 0, 0.77778],
      "8857": [0.08333, 0.58333, 0, 0, 0.77778],
      "8866": [0, 0.69444, 0, 0, 0.61111],
      "8867": [0, 0.69444, 0, 0, 0.61111],
      "8868": [0, 0.69444, 0, 0, 0.77778],
      "8869": [0, 0.69444, 0, 0, 0.77778],
      "8872": [0.249, 0.75, 0, 0, 0.867],
      "8900": [-0.05555, 0.44445, 0, 0, 0.5],
      "8901": [-0.05555, 0.44445, 0, 0, 0.27778],
      "8902": [-0.03472, 0.46528, 0, 0, 0.5],
      "8904": [5e-3, 0.505, 0, 0, 0.9],
      "8942": [0.03, 0.903, 0, 0, 0.278],
      "8943": [-0.19, 0.313, 0, 0, 1.172],
      "8945": [-0.1, 0.823, 0, 0, 1.282],
      "8968": [0.25, 0.75, 0, 0, 0.44445],
      "8969": [0.25, 0.75, 0, 0, 0.44445],
      "8970": [0.25, 0.75, 0, 0, 0.44445],
      "8971": [0.25, 0.75, 0, 0, 0.44445],
      "8994": [-0.14236, 0.35764, 0, 0, 1],
      "8995": [-0.14236, 0.35764, 0, 0, 1],
      "9136": [0.244, 0.744, 0, 0, 0.412],
      "9137": [0.244, 0.745, 0, 0, 0.412],
      "9651": [0.19444, 0.69444, 0, 0, 0.88889],
      "9657": [-0.03472, 0.46528, 0, 0, 0.5],
      "9661": [0.19444, 0.69444, 0, 0, 0.88889],
      "9667": [-0.03472, 0.46528, 0, 0, 0.5],
      "9711": [0.19444, 0.69444, 0, 0, 1],
      "9824": [0.12963, 0.69444, 0, 0, 0.77778],
      "9825": [0.12963, 0.69444, 0, 0, 0.77778],
      "9826": [0.12963, 0.69444, 0, 0, 0.77778],
      "9827": [0.12963, 0.69444, 0, 0, 0.77778],
      "9837": [0, 0.75, 0, 0, 0.38889],
      "9838": [0.19444, 0.69444, 0, 0, 0.38889],
      "9839": [0.19444, 0.69444, 0, 0, 0.38889],
      "10216": [0.25, 0.75, 0, 0, 0.38889],
      "10217": [0.25, 0.75, 0, 0, 0.38889],
      "10222": [0.244, 0.744, 0, 0, 0.412],
      "10223": [0.244, 0.745, 0, 0, 0.412],
      "10229": [0.011, 0.511, 0, 0, 1.609],
      "10230": [0.011, 0.511, 0, 0, 1.638],
      "10231": [0.011, 0.511, 0, 0, 1.859],
      "10232": [0.024, 0.525, 0, 0, 1.609],
      "10233": [0.024, 0.525, 0, 0, 1.638],
      "10234": [0.024, 0.525, 0, 0, 1.858],
      "10236": [0.011, 0.511, 0, 0, 1.638],
      "10815": [0, 0.68333, 0, 0, 0.75],
      "10927": [0.13597, 0.63597, 0, 0, 0.77778],
      "10928": [0.13597, 0.63597, 0, 0, 0.77778],
      "57376": [0.19444, 0.69444, 0, 0, 0]
    },
    "Math-BoldItalic": {
      "32": [0, 0, 0, 0, 0.25],
      "48": [0, 0.44444, 0, 0, 0.575],
      "49": [0, 0.44444, 0, 0, 0.575],
      "50": [0, 0.44444, 0, 0, 0.575],
      "51": [0.19444, 0.44444, 0, 0, 0.575],
      "52": [0.19444, 0.44444, 0, 0, 0.575],
      "53": [0.19444, 0.44444, 0, 0, 0.575],
      "54": [0, 0.64444, 0, 0, 0.575],
      "55": [0.19444, 0.44444, 0, 0, 0.575],
      "56": [0, 0.64444, 0, 0, 0.575],
      "57": [0.19444, 0.44444, 0, 0, 0.575],
      "65": [0, 0.68611, 0, 0, 0.86944],
      "66": [0, 0.68611, 0.04835, 0, 0.8664],
      "67": [0, 0.68611, 0.06979, 0, 0.81694],
      "68": [0, 0.68611, 0.03194, 0, 0.93812],
      "69": [0, 0.68611, 0.05451, 0, 0.81007],
      "70": [0, 0.68611, 0.15972, 0, 0.68889],
      "71": [0, 0.68611, 0, 0, 0.88673],
      "72": [0, 0.68611, 0.08229, 0, 0.98229],
      "73": [0, 0.68611, 0.07778, 0, 0.51111],
      "74": [0, 0.68611, 0.10069, 0, 0.63125],
      "75": [0, 0.68611, 0.06979, 0, 0.97118],
      "76": [0, 0.68611, 0, 0, 0.75555],
      "77": [0, 0.68611, 0.11424, 0, 1.14201],
      "78": [0, 0.68611, 0.11424, 0, 0.95034],
      "79": [0, 0.68611, 0.03194, 0, 0.83666],
      "80": [0, 0.68611, 0.15972, 0, 0.72309],
      "81": [0.19444, 0.68611, 0, 0, 0.86861],
      "82": [0, 0.68611, 421e-5, 0, 0.87235],
      "83": [0, 0.68611, 0.05382, 0, 0.69271],
      "84": [0, 0.68611, 0.15972, 0, 0.63663],
      "85": [0, 0.68611, 0.11424, 0, 0.80027],
      "86": [0, 0.68611, 0.25555, 0, 0.67778],
      "87": [0, 0.68611, 0.15972, 0, 1.09305],
      "88": [0, 0.68611, 0.07778, 0, 0.94722],
      "89": [0, 0.68611, 0.25555, 0, 0.67458],
      "90": [0, 0.68611, 0.06979, 0, 0.77257],
      "97": [0, 0.44444, 0, 0, 0.63287],
      "98": [0, 0.69444, 0, 0, 0.52083],
      "99": [0, 0.44444, 0, 0, 0.51342],
      "100": [0, 0.69444, 0, 0, 0.60972],
      "101": [0, 0.44444, 0, 0, 0.55361],
      "102": [0.19444, 0.69444, 0.11042, 0, 0.56806],
      "103": [0.19444, 0.44444, 0.03704, 0, 0.5449],
      "104": [0, 0.69444, 0, 0, 0.66759],
      "105": [0, 0.69326, 0, 0, 0.4048],
      "106": [0.19444, 0.69326, 0.0622, 0, 0.47083],
      "107": [0, 0.69444, 0.01852, 0, 0.6037],
      "108": [0, 0.69444, 88e-4, 0, 0.34815],
      "109": [0, 0.44444, 0, 0, 1.0324],
      "110": [0, 0.44444, 0, 0, 0.71296],
      "111": [0, 0.44444, 0, 0, 0.58472],
      "112": [0.19444, 0.44444, 0, 0, 0.60092],
      "113": [0.19444, 0.44444, 0.03704, 0, 0.54213],
      "114": [0, 0.44444, 0.03194, 0, 0.5287],
      "115": [0, 0.44444, 0, 0, 0.53125],
      "116": [0, 0.63492, 0, 0, 0.41528],
      "117": [0, 0.44444, 0, 0, 0.68102],
      "118": [0, 0.44444, 0.03704, 0, 0.56666],
      "119": [0, 0.44444, 0.02778, 0, 0.83148],
      "120": [0, 0.44444, 0, 0, 0.65903],
      "121": [0.19444, 0.44444, 0.03704, 0, 0.59028],
      "122": [0, 0.44444, 0.04213, 0, 0.55509],
      "160": [0, 0, 0, 0, 0.25],
      "915": [0, 0.68611, 0.15972, 0, 0.65694],
      "916": [0, 0.68611, 0, 0, 0.95833],
      "920": [0, 0.68611, 0.03194, 0, 0.86722],
      "923": [0, 0.68611, 0, 0, 0.80555],
      "926": [0, 0.68611, 0.07458, 0, 0.84125],
      "928": [0, 0.68611, 0.08229, 0, 0.98229],
      "931": [0, 0.68611, 0.05451, 0, 0.88507],
      "933": [0, 0.68611, 0.15972, 0, 0.67083],
      "934": [0, 0.68611, 0, 0, 0.76666],
      "936": [0, 0.68611, 0.11653, 0, 0.71402],
      "937": [0, 0.68611, 0.04835, 0, 0.8789],
      "945": [0, 0.44444, 0, 0, 0.76064],
      "946": [0.19444, 0.69444, 0.03403, 0, 0.65972],
      "947": [0.19444, 0.44444, 0.06389, 0, 0.59003],
      "948": [0, 0.69444, 0.03819, 0, 0.52222],
      "949": [0, 0.44444, 0, 0, 0.52882],
      "950": [0.19444, 0.69444, 0.06215, 0, 0.50833],
      "951": [0.19444, 0.44444, 0.03704, 0, 0.6],
      "952": [0, 0.69444, 0.03194, 0, 0.5618],
      "953": [0, 0.44444, 0, 0, 0.41204],
      "954": [0, 0.44444, 0, 0, 0.66759],
      "955": [0, 0.69444, 0, 0, 0.67083],
      "956": [0.19444, 0.44444, 0, 0, 0.70787],
      "957": [0, 0.44444, 0.06898, 0, 0.57685],
      "958": [0.19444, 0.69444, 0.03021, 0, 0.50833],
      "959": [0, 0.44444, 0, 0, 0.58472],
      "960": [0, 0.44444, 0.03704, 0, 0.68241],
      "961": [0.19444, 0.44444, 0, 0, 0.6118],
      "962": [0.09722, 0.44444, 0.07917, 0, 0.42361],
      "963": [0, 0.44444, 0.03704, 0, 0.68588],
      "964": [0, 0.44444, 0.13472, 0, 0.52083],
      "965": [0, 0.44444, 0.03704, 0, 0.63055],
      "966": [0.19444, 0.44444, 0, 0, 0.74722],
      "967": [0.19444, 0.44444, 0, 0, 0.71805],
      "968": [0.19444, 0.69444, 0.03704, 0, 0.75833],
      "969": [0, 0.44444, 0.03704, 0, 0.71782],
      "977": [0, 0.69444, 0, 0, 0.69155],
      "981": [0.19444, 0.69444, 0, 0, 0.7125],
      "982": [0, 0.44444, 0.03194, 0, 0.975],
      "1009": [0.19444, 0.44444, 0, 0, 0.6118],
      "1013": [0, 0.44444, 0, 0, 0.48333],
      "57649": [0, 0.44444, 0, 0, 0.39352],
      "57911": [0.19444, 0.44444, 0, 0, 0.43889]
    },
    "Math-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "48": [0, 0.43056, 0, 0, 0.5],
      "49": [0, 0.43056, 0, 0, 0.5],
      "50": [0, 0.43056, 0, 0, 0.5],
      "51": [0.19444, 0.43056, 0, 0, 0.5],
      "52": [0.19444, 0.43056, 0, 0, 0.5],
      "53": [0.19444, 0.43056, 0, 0, 0.5],
      "54": [0, 0.64444, 0, 0, 0.5],
      "55": [0.19444, 0.43056, 0, 0, 0.5],
      "56": [0, 0.64444, 0, 0, 0.5],
      "57": [0.19444, 0.43056, 0, 0, 0.5],
      "65": [0, 0.68333, 0, 0.13889, 0.75],
      "66": [0, 0.68333, 0.05017, 0.08334, 0.75851],
      "67": [0, 0.68333, 0.07153, 0.08334, 0.71472],
      "68": [0, 0.68333, 0.02778, 0.05556, 0.82792],
      "69": [0, 0.68333, 0.05764, 0.08334, 0.7382],
      "70": [0, 0.68333, 0.13889, 0.08334, 0.64306],
      "71": [0, 0.68333, 0, 0.08334, 0.78625],
      "72": [0, 0.68333, 0.08125, 0.05556, 0.83125],
      "73": [0, 0.68333, 0.07847, 0.11111, 0.43958],
      "74": [0, 0.68333, 0.09618, 0.16667, 0.55451],
      "75": [0, 0.68333, 0.07153, 0.05556, 0.84931],
      "76": [0, 0.68333, 0, 0.02778, 0.68056],
      "77": [0, 0.68333, 0.10903, 0.08334, 0.97014],
      "78": [0, 0.68333, 0.10903, 0.08334, 0.80347],
      "79": [0, 0.68333, 0.02778, 0.08334, 0.76278],
      "80": [0, 0.68333, 0.13889, 0.08334, 0.64201],
      "81": [0.19444, 0.68333, 0, 0.08334, 0.79056],
      "82": [0, 0.68333, 773e-5, 0.08334, 0.75929],
      "83": [0, 0.68333, 0.05764, 0.08334, 0.6132],
      "84": [0, 0.68333, 0.13889, 0.08334, 0.58438],
      "85": [0, 0.68333, 0.10903, 0.02778, 0.68278],
      "86": [0, 0.68333, 0.22222, 0, 0.58333],
      "87": [0, 0.68333, 0.13889, 0, 0.94445],
      "88": [0, 0.68333, 0.07847, 0.08334, 0.82847],
      "89": [0, 0.68333, 0.22222, 0, 0.58056],
      "90": [0, 0.68333, 0.07153, 0.08334, 0.68264],
      "97": [0, 0.43056, 0, 0, 0.52859],
      "98": [0, 0.69444, 0, 0, 0.42917],
      "99": [0, 0.43056, 0, 0.05556, 0.43276],
      "100": [0, 0.69444, 0, 0.16667, 0.52049],
      "101": [0, 0.43056, 0, 0.05556, 0.46563],
      "102": [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
      "103": [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
      "104": [0, 0.69444, 0, 0, 0.57616],
      "105": [0, 0.65952, 0, 0, 0.34451],
      "106": [0.19444, 0.65952, 0.05724, 0, 0.41181],
      "107": [0, 0.69444, 0.03148, 0, 0.5206],
      "108": [0, 0.69444, 0.01968, 0.08334, 0.29838],
      "109": [0, 0.43056, 0, 0, 0.87801],
      "110": [0, 0.43056, 0, 0, 0.60023],
      "111": [0, 0.43056, 0, 0.05556, 0.48472],
      "112": [0.19444, 0.43056, 0, 0.08334, 0.50313],
      "113": [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
      "114": [0, 0.43056, 0.02778, 0.05556, 0.45116],
      "115": [0, 0.43056, 0, 0.05556, 0.46875],
      "116": [0, 0.61508, 0, 0.08334, 0.36111],
      "117": [0, 0.43056, 0, 0.02778, 0.57246],
      "118": [0, 0.43056, 0.03588, 0.02778, 0.48472],
      "119": [0, 0.43056, 0.02691, 0.08334, 0.71592],
      "120": [0, 0.43056, 0, 0.02778, 0.57153],
      "121": [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
      "122": [0, 0.43056, 0.04398, 0.05556, 0.46505],
      "160": [0, 0, 0, 0, 0.25],
      "915": [0, 0.68333, 0.13889, 0.08334, 0.61528],
      "916": [0, 0.68333, 0, 0.16667, 0.83334],
      "920": [0, 0.68333, 0.02778, 0.08334, 0.76278],
      "923": [0, 0.68333, 0, 0.16667, 0.69445],
      "926": [0, 0.68333, 0.07569, 0.08334, 0.74236],
      "928": [0, 0.68333, 0.08125, 0.05556, 0.83125],
      "931": [0, 0.68333, 0.05764, 0.08334, 0.77986],
      "933": [0, 0.68333, 0.13889, 0.05556, 0.58333],
      "934": [0, 0.68333, 0, 0.08334, 0.66667],
      "936": [0, 0.68333, 0.11, 0.05556, 0.61222],
      "937": [0, 0.68333, 0.05017, 0.08334, 0.7724],
      "945": [0, 0.43056, 37e-4, 0.02778, 0.6397],
      "946": [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
      "947": [0.19444, 0.43056, 0.05556, 0, 0.51773],
      "948": [0, 0.69444, 0.03785, 0.05556, 0.44444],
      "949": [0, 0.43056, 0, 0.08334, 0.46632],
      "950": [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
      "951": [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
      "952": [0, 0.69444, 0.02778, 0.08334, 0.46944],
      "953": [0, 0.43056, 0, 0.05556, 0.35394],
      "954": [0, 0.43056, 0, 0, 0.57616],
      "955": [0, 0.69444, 0, 0, 0.58334],
      "956": [0.19444, 0.43056, 0, 0.02778, 0.60255],
      "957": [0, 0.43056, 0.06366, 0.02778, 0.49398],
      "958": [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
      "959": [0, 0.43056, 0, 0.05556, 0.48472],
      "960": [0, 0.43056, 0.03588, 0, 0.57003],
      "961": [0.19444, 0.43056, 0, 0.08334, 0.51702],
      "962": [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
      "963": [0, 0.43056, 0.03588, 0, 0.57141],
      "964": [0, 0.43056, 0.1132, 0.02778, 0.43715],
      "965": [0, 0.43056, 0.03588, 0.02778, 0.54028],
      "966": [0.19444, 0.43056, 0, 0.08334, 0.65417],
      "967": [0.19444, 0.43056, 0, 0.05556, 0.62569],
      "968": [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
      "969": [0, 0.43056, 0.03588, 0, 0.62245],
      "977": [0, 0.69444, 0, 0.08334, 0.59144],
      "981": [0.19444, 0.69444, 0, 0.08334, 0.59583],
      "982": [0, 0.43056, 0.02778, 0, 0.82813],
      "1009": [0.19444, 0.43056, 0, 0.08334, 0.51702],
      "1013": [0, 0.43056, 0, 0.05556, 0.4059],
      "57649": [0, 0.43056, 0, 0.02778, 0.32246],
      "57911": [0.19444, 0.43056, 0, 0.08334, 0.38403]
    },
    "SansSerif-Bold": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.36667],
      "34": [0, 0.69444, 0, 0, 0.55834],
      "35": [0.19444, 0.69444, 0, 0, 0.91667],
      "36": [0.05556, 0.75, 0, 0, 0.55],
      "37": [0.05556, 0.75, 0, 0, 1.02912],
      "38": [0, 0.69444, 0, 0, 0.83056],
      "39": [0, 0.69444, 0, 0, 0.30556],
      "40": [0.25, 0.75, 0, 0, 0.42778],
      "41": [0.25, 0.75, 0, 0, 0.42778],
      "42": [0, 0.75, 0, 0, 0.55],
      "43": [0.11667, 0.61667, 0, 0, 0.85556],
      "44": [0.10556, 0.13056, 0, 0, 0.30556],
      "45": [0, 0.45833, 0, 0, 0.36667],
      "46": [0, 0.13056, 0, 0, 0.30556],
      "47": [0.25, 0.75, 0, 0, 0.55],
      "48": [0, 0.69444, 0, 0, 0.55],
      "49": [0, 0.69444, 0, 0, 0.55],
      "50": [0, 0.69444, 0, 0, 0.55],
      "51": [0, 0.69444, 0, 0, 0.55],
      "52": [0, 0.69444, 0, 0, 0.55],
      "53": [0, 0.69444, 0, 0, 0.55],
      "54": [0, 0.69444, 0, 0, 0.55],
      "55": [0, 0.69444, 0, 0, 0.55],
      "56": [0, 0.69444, 0, 0, 0.55],
      "57": [0, 0.69444, 0, 0, 0.55],
      "58": [0, 0.45833, 0, 0, 0.30556],
      "59": [0.10556, 0.45833, 0, 0, 0.30556],
      "61": [-0.09375, 0.40625, 0, 0, 0.85556],
      "63": [0, 0.69444, 0, 0, 0.51945],
      "64": [0, 0.69444, 0, 0, 0.73334],
      "65": [0, 0.69444, 0, 0, 0.73334],
      "66": [0, 0.69444, 0, 0, 0.73334],
      "67": [0, 0.69444, 0, 0, 0.70278],
      "68": [0, 0.69444, 0, 0, 0.79445],
      "69": [0, 0.69444, 0, 0, 0.64167],
      "70": [0, 0.69444, 0, 0, 0.61111],
      "71": [0, 0.69444, 0, 0, 0.73334],
      "72": [0, 0.69444, 0, 0, 0.79445],
      "73": [0, 0.69444, 0, 0, 0.33056],
      "74": [0, 0.69444, 0, 0, 0.51945],
      "75": [0, 0.69444, 0, 0, 0.76389],
      "76": [0, 0.69444, 0, 0, 0.58056],
      "77": [0, 0.69444, 0, 0, 0.97778],
      "78": [0, 0.69444, 0, 0, 0.79445],
      "79": [0, 0.69444, 0, 0, 0.79445],
      "80": [0, 0.69444, 0, 0, 0.70278],
      "81": [0.10556, 0.69444, 0, 0, 0.79445],
      "82": [0, 0.69444, 0, 0, 0.70278],
      "83": [0, 0.69444, 0, 0, 0.61111],
      "84": [0, 0.69444, 0, 0, 0.73334],
      "85": [0, 0.69444, 0, 0, 0.76389],
      "86": [0, 0.69444, 0.01528, 0, 0.73334],
      "87": [0, 0.69444, 0.01528, 0, 1.03889],
      "88": [0, 0.69444, 0, 0, 0.73334],
      "89": [0, 0.69444, 0.0275, 0, 0.73334],
      "90": [0, 0.69444, 0, 0, 0.67223],
      "91": [0.25, 0.75, 0, 0, 0.34306],
      "93": [0.25, 0.75, 0, 0, 0.34306],
      "94": [0, 0.69444, 0, 0, 0.55],
      "95": [0.35, 0.10833, 0.03056, 0, 0.55],
      "97": [0, 0.45833, 0, 0, 0.525],
      "98": [0, 0.69444, 0, 0, 0.56111],
      "99": [0, 0.45833, 0, 0, 0.48889],
      "100": [0, 0.69444, 0, 0, 0.56111],
      "101": [0, 0.45833, 0, 0, 0.51111],
      "102": [0, 0.69444, 0.07639, 0, 0.33611],
      "103": [0.19444, 0.45833, 0.01528, 0, 0.55],
      "104": [0, 0.69444, 0, 0, 0.56111],
      "105": [0, 0.69444, 0, 0, 0.25556],
      "106": [0.19444, 0.69444, 0, 0, 0.28611],
      "107": [0, 0.69444, 0, 0, 0.53056],
      "108": [0, 0.69444, 0, 0, 0.25556],
      "109": [0, 0.45833, 0, 0, 0.86667],
      "110": [0, 0.45833, 0, 0, 0.56111],
      "111": [0, 0.45833, 0, 0, 0.55],
      "112": [0.19444, 0.45833, 0, 0, 0.56111],
      "113": [0.19444, 0.45833, 0, 0, 0.56111],
      "114": [0, 0.45833, 0.01528, 0, 0.37222],
      "115": [0, 0.45833, 0, 0, 0.42167],
      "116": [0, 0.58929, 0, 0, 0.40417],
      "117": [0, 0.45833, 0, 0, 0.56111],
      "118": [0, 0.45833, 0.01528, 0, 0.5],
      "119": [0, 0.45833, 0.01528, 0, 0.74445],
      "120": [0, 0.45833, 0, 0, 0.5],
      "121": [0.19444, 0.45833, 0.01528, 0, 0.5],
      "122": [0, 0.45833, 0, 0, 0.47639],
      "126": [0.35, 0.34444, 0, 0, 0.55],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.69444, 0, 0, 0.55],
      "176": [0, 0.69444, 0, 0, 0.73334],
      "180": [0, 0.69444, 0, 0, 0.55],
      "184": [0.17014, 0, 0, 0, 0.48889],
      "305": [0, 0.45833, 0, 0, 0.25556],
      "567": [0.19444, 0.45833, 0, 0, 0.28611],
      "710": [0, 0.69444, 0, 0, 0.55],
      "711": [0, 0.63542, 0, 0, 0.55],
      "713": [0, 0.63778, 0, 0, 0.55],
      "728": [0, 0.69444, 0, 0, 0.55],
      "729": [0, 0.69444, 0, 0, 0.30556],
      "730": [0, 0.69444, 0, 0, 0.73334],
      "732": [0, 0.69444, 0, 0, 0.55],
      "733": [0, 0.69444, 0, 0, 0.55],
      "915": [0, 0.69444, 0, 0, 0.58056],
      "916": [0, 0.69444, 0, 0, 0.91667],
      "920": [0, 0.69444, 0, 0, 0.85556],
      "923": [0, 0.69444, 0, 0, 0.67223],
      "926": [0, 0.69444, 0, 0, 0.73334],
      "928": [0, 0.69444, 0, 0, 0.79445],
      "931": [0, 0.69444, 0, 0, 0.79445],
      "933": [0, 0.69444, 0, 0, 0.85556],
      "934": [0, 0.69444, 0, 0, 0.79445],
      "936": [0, 0.69444, 0, 0, 0.85556],
      "937": [0, 0.69444, 0, 0, 0.79445],
      "8211": [0, 0.45833, 0.03056, 0, 0.55],
      "8212": [0, 0.45833, 0.03056, 0, 1.10001],
      "8216": [0, 0.69444, 0, 0, 0.30556],
      "8217": [0, 0.69444, 0, 0, 0.30556],
      "8220": [0, 0.69444, 0, 0, 0.55834],
      "8221": [0, 0.69444, 0, 0, 0.55834]
    },
    "SansSerif-Italic": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0.05733, 0, 0.31945],
      "34": [0, 0.69444, 316e-5, 0, 0.5],
      "35": [0.19444, 0.69444, 0.05087, 0, 0.83334],
      "36": [0.05556, 0.75, 0.11156, 0, 0.5],
      "37": [0.05556, 0.75, 0.03126, 0, 0.83334],
      "38": [0, 0.69444, 0.03058, 0, 0.75834],
      "39": [0, 0.69444, 0.07816, 0, 0.27778],
      "40": [0.25, 0.75, 0.13164, 0, 0.38889],
      "41": [0.25, 0.75, 0.02536, 0, 0.38889],
      "42": [0, 0.75, 0.11775, 0, 0.5],
      "43": [0.08333, 0.58333, 0.02536, 0, 0.77778],
      "44": [0.125, 0.08333, 0, 0, 0.27778],
      "45": [0, 0.44444, 0.01946, 0, 0.33333],
      "46": [0, 0.08333, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0.13164, 0, 0.5],
      "48": [0, 0.65556, 0.11156, 0, 0.5],
      "49": [0, 0.65556, 0.11156, 0, 0.5],
      "50": [0, 0.65556, 0.11156, 0, 0.5],
      "51": [0, 0.65556, 0.11156, 0, 0.5],
      "52": [0, 0.65556, 0.11156, 0, 0.5],
      "53": [0, 0.65556, 0.11156, 0, 0.5],
      "54": [0, 0.65556, 0.11156, 0, 0.5],
      "55": [0, 0.65556, 0.11156, 0, 0.5],
      "56": [0, 0.65556, 0.11156, 0, 0.5],
      "57": [0, 0.65556, 0.11156, 0, 0.5],
      "58": [0, 0.44444, 0.02502, 0, 0.27778],
      "59": [0.125, 0.44444, 0.02502, 0, 0.27778],
      "61": [-0.13, 0.37, 0.05087, 0, 0.77778],
      "63": [0, 0.69444, 0.11809, 0, 0.47222],
      "64": [0, 0.69444, 0.07555, 0, 0.66667],
      "65": [0, 0.69444, 0, 0, 0.66667],
      "66": [0, 0.69444, 0.08293, 0, 0.66667],
      "67": [0, 0.69444, 0.11983, 0, 0.63889],
      "68": [0, 0.69444, 0.07555, 0, 0.72223],
      "69": [0, 0.69444, 0.11983, 0, 0.59722],
      "70": [0, 0.69444, 0.13372, 0, 0.56945],
      "71": [0, 0.69444, 0.11983, 0, 0.66667],
      "72": [0, 0.69444, 0.08094, 0, 0.70834],
      "73": [0, 0.69444, 0.13372, 0, 0.27778],
      "74": [0, 0.69444, 0.08094, 0, 0.47222],
      "75": [0, 0.69444, 0.11983, 0, 0.69445],
      "76": [0, 0.69444, 0, 0, 0.54167],
      "77": [0, 0.69444, 0.08094, 0, 0.875],
      "78": [0, 0.69444, 0.08094, 0, 0.70834],
      "79": [0, 0.69444, 0.07555, 0, 0.73611],
      "80": [0, 0.69444, 0.08293, 0, 0.63889],
      "81": [0.125, 0.69444, 0.07555, 0, 0.73611],
      "82": [0, 0.69444, 0.08293, 0, 0.64584],
      "83": [0, 0.69444, 0.09205, 0, 0.55556],
      "84": [0, 0.69444, 0.13372, 0, 0.68056],
      "85": [0, 0.69444, 0.08094, 0, 0.6875],
      "86": [0, 0.69444, 0.1615, 0, 0.66667],
      "87": [0, 0.69444, 0.1615, 0, 0.94445],
      "88": [0, 0.69444, 0.13372, 0, 0.66667],
      "89": [0, 0.69444, 0.17261, 0, 0.66667],
      "90": [0, 0.69444, 0.11983, 0, 0.61111],
      "91": [0.25, 0.75, 0.15942, 0, 0.28889],
      "93": [0.25, 0.75, 0.08719, 0, 0.28889],
      "94": [0, 0.69444, 0.0799, 0, 0.5],
      "95": [0.35, 0.09444, 0.08616, 0, 0.5],
      "97": [0, 0.44444, 981e-5, 0, 0.48056],
      "98": [0, 0.69444, 0.03057, 0, 0.51667],
      "99": [0, 0.44444, 0.08336, 0, 0.44445],
      "100": [0, 0.69444, 0.09483, 0, 0.51667],
      "101": [0, 0.44444, 0.06778, 0, 0.44445],
      "102": [0, 0.69444, 0.21705, 0, 0.30556],
      "103": [0.19444, 0.44444, 0.10836, 0, 0.5],
      "104": [0, 0.69444, 0.01778, 0, 0.51667],
      "105": [0, 0.67937, 0.09718, 0, 0.23889],
      "106": [0.19444, 0.67937, 0.09162, 0, 0.26667],
      "107": [0, 0.69444, 0.08336, 0, 0.48889],
      "108": [0, 0.69444, 0.09483, 0, 0.23889],
      "109": [0, 0.44444, 0.01778, 0, 0.79445],
      "110": [0, 0.44444, 0.01778, 0, 0.51667],
      "111": [0, 0.44444, 0.06613, 0, 0.5],
      "112": [0.19444, 0.44444, 0.0389, 0, 0.51667],
      "113": [0.19444, 0.44444, 0.04169, 0, 0.51667],
      "114": [0, 0.44444, 0.10836, 0, 0.34167],
      "115": [0, 0.44444, 0.0778, 0, 0.38333],
      "116": [0, 0.57143, 0.07225, 0, 0.36111],
      "117": [0, 0.44444, 0.04169, 0, 0.51667],
      "118": [0, 0.44444, 0.10836, 0, 0.46111],
      "119": [0, 0.44444, 0.10836, 0, 0.68334],
      "120": [0, 0.44444, 0.09169, 0, 0.46111],
      "121": [0.19444, 0.44444, 0.10836, 0, 0.46111],
      "122": [0, 0.44444, 0.08752, 0, 0.43472],
      "126": [0.35, 0.32659, 0.08826, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.67937, 0.06385, 0, 0.5],
      "176": [0, 0.69444, 0, 0, 0.73752],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "305": [0, 0.44444, 0.04169, 0, 0.23889],
      "567": [0.19444, 0.44444, 0.04169, 0, 0.26667],
      "710": [0, 0.69444, 0.0799, 0, 0.5],
      "711": [0, 0.63194, 0.08432, 0, 0.5],
      "713": [0, 0.60889, 0.08776, 0, 0.5],
      "714": [0, 0.69444, 0.09205, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0.09483, 0, 0.5],
      "729": [0, 0.67937, 0.07774, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.73752],
      "732": [0, 0.67659, 0.08826, 0, 0.5],
      "733": [0, 0.69444, 0.09205, 0, 0.5],
      "915": [0, 0.69444, 0.13372, 0, 0.54167],
      "916": [0, 0.69444, 0, 0, 0.83334],
      "920": [0, 0.69444, 0.07555, 0, 0.77778],
      "923": [0, 0.69444, 0, 0, 0.61111],
      "926": [0, 0.69444, 0.12816, 0, 0.66667],
      "928": [0, 0.69444, 0.08094, 0, 0.70834],
      "931": [0, 0.69444, 0.11983, 0, 0.72222],
      "933": [0, 0.69444, 0.09031, 0, 0.77778],
      "934": [0, 0.69444, 0.04603, 0, 0.72222],
      "936": [0, 0.69444, 0.09031, 0, 0.77778],
      "937": [0, 0.69444, 0.08293, 0, 0.72222],
      "8211": [0, 0.44444, 0.08616, 0, 0.5],
      "8212": [0, 0.44444, 0.08616, 0, 1],
      "8216": [0, 0.69444, 0.07816, 0, 0.27778],
      "8217": [0, 0.69444, 0.07816, 0, 0.27778],
      "8220": [0, 0.69444, 0.14205, 0, 0.5],
      "8221": [0, 0.69444, 316e-5, 0, 0.5]
    },
    "SansSerif-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "33": [0, 0.69444, 0, 0, 0.31945],
      "34": [0, 0.69444, 0, 0, 0.5],
      "35": [0.19444, 0.69444, 0, 0, 0.83334],
      "36": [0.05556, 0.75, 0, 0, 0.5],
      "37": [0.05556, 0.75, 0, 0, 0.83334],
      "38": [0, 0.69444, 0, 0, 0.75834],
      "39": [0, 0.69444, 0, 0, 0.27778],
      "40": [0.25, 0.75, 0, 0, 0.38889],
      "41": [0.25, 0.75, 0, 0, 0.38889],
      "42": [0, 0.75, 0, 0, 0.5],
      "43": [0.08333, 0.58333, 0, 0, 0.77778],
      "44": [0.125, 0.08333, 0, 0, 0.27778],
      "45": [0, 0.44444, 0, 0, 0.33333],
      "46": [0, 0.08333, 0, 0, 0.27778],
      "47": [0.25, 0.75, 0, 0, 0.5],
      "48": [0, 0.65556, 0, 0, 0.5],
      "49": [0, 0.65556, 0, 0, 0.5],
      "50": [0, 0.65556, 0, 0, 0.5],
      "51": [0, 0.65556, 0, 0, 0.5],
      "52": [0, 0.65556, 0, 0, 0.5],
      "53": [0, 0.65556, 0, 0, 0.5],
      "54": [0, 0.65556, 0, 0, 0.5],
      "55": [0, 0.65556, 0, 0, 0.5],
      "56": [0, 0.65556, 0, 0, 0.5],
      "57": [0, 0.65556, 0, 0, 0.5],
      "58": [0, 0.44444, 0, 0, 0.27778],
      "59": [0.125, 0.44444, 0, 0, 0.27778],
      "61": [-0.13, 0.37, 0, 0, 0.77778],
      "63": [0, 0.69444, 0, 0, 0.47222],
      "64": [0, 0.69444, 0, 0, 0.66667],
      "65": [0, 0.69444, 0, 0, 0.66667],
      "66": [0, 0.69444, 0, 0, 0.66667],
      "67": [0, 0.69444, 0, 0, 0.63889],
      "68": [0, 0.69444, 0, 0, 0.72223],
      "69": [0, 0.69444, 0, 0, 0.59722],
      "70": [0, 0.69444, 0, 0, 0.56945],
      "71": [0, 0.69444, 0, 0, 0.66667],
      "72": [0, 0.69444, 0, 0, 0.70834],
      "73": [0, 0.69444, 0, 0, 0.27778],
      "74": [0, 0.69444, 0, 0, 0.47222],
      "75": [0, 0.69444, 0, 0, 0.69445],
      "76": [0, 0.69444, 0, 0, 0.54167],
      "77": [0, 0.69444, 0, 0, 0.875],
      "78": [0, 0.69444, 0, 0, 0.70834],
      "79": [0, 0.69444, 0, 0, 0.73611],
      "80": [0, 0.69444, 0, 0, 0.63889],
      "81": [0.125, 0.69444, 0, 0, 0.73611],
      "82": [0, 0.69444, 0, 0, 0.64584],
      "83": [0, 0.69444, 0, 0, 0.55556],
      "84": [0, 0.69444, 0, 0, 0.68056],
      "85": [0, 0.69444, 0, 0, 0.6875],
      "86": [0, 0.69444, 0.01389, 0, 0.66667],
      "87": [0, 0.69444, 0.01389, 0, 0.94445],
      "88": [0, 0.69444, 0, 0, 0.66667],
      "89": [0, 0.69444, 0.025, 0, 0.66667],
      "90": [0, 0.69444, 0, 0, 0.61111],
      "91": [0.25, 0.75, 0, 0, 0.28889],
      "93": [0.25, 0.75, 0, 0, 0.28889],
      "94": [0, 0.69444, 0, 0, 0.5],
      "95": [0.35, 0.09444, 0.02778, 0, 0.5],
      "97": [0, 0.44444, 0, 0, 0.48056],
      "98": [0, 0.69444, 0, 0, 0.51667],
      "99": [0, 0.44444, 0, 0, 0.44445],
      "100": [0, 0.69444, 0, 0, 0.51667],
      "101": [0, 0.44444, 0, 0, 0.44445],
      "102": [0, 0.69444, 0.06944, 0, 0.30556],
      "103": [0.19444, 0.44444, 0.01389, 0, 0.5],
      "104": [0, 0.69444, 0, 0, 0.51667],
      "105": [0, 0.67937, 0, 0, 0.23889],
      "106": [0.19444, 0.67937, 0, 0, 0.26667],
      "107": [0, 0.69444, 0, 0, 0.48889],
      "108": [0, 0.69444, 0, 0, 0.23889],
      "109": [0, 0.44444, 0, 0, 0.79445],
      "110": [0, 0.44444, 0, 0, 0.51667],
      "111": [0, 0.44444, 0, 0, 0.5],
      "112": [0.19444, 0.44444, 0, 0, 0.51667],
      "113": [0.19444, 0.44444, 0, 0, 0.51667],
      "114": [0, 0.44444, 0.01389, 0, 0.34167],
      "115": [0, 0.44444, 0, 0, 0.38333],
      "116": [0, 0.57143, 0, 0, 0.36111],
      "117": [0, 0.44444, 0, 0, 0.51667],
      "118": [0, 0.44444, 0.01389, 0, 0.46111],
      "119": [0, 0.44444, 0.01389, 0, 0.68334],
      "120": [0, 0.44444, 0, 0, 0.46111],
      "121": [0.19444, 0.44444, 0.01389, 0, 0.46111],
      "122": [0, 0.44444, 0, 0, 0.43472],
      "126": [0.35, 0.32659, 0, 0, 0.5],
      "160": [0, 0, 0, 0, 0.25],
      "168": [0, 0.67937, 0, 0, 0.5],
      "176": [0, 0.69444, 0, 0, 0.66667],
      "184": [0.17014, 0, 0, 0, 0.44445],
      "305": [0, 0.44444, 0, 0, 0.23889],
      "567": [0.19444, 0.44444, 0, 0, 0.26667],
      "710": [0, 0.69444, 0, 0, 0.5],
      "711": [0, 0.63194, 0, 0, 0.5],
      "713": [0, 0.60889, 0, 0, 0.5],
      "714": [0, 0.69444, 0, 0, 0.5],
      "715": [0, 0.69444, 0, 0, 0.5],
      "728": [0, 0.69444, 0, 0, 0.5],
      "729": [0, 0.67937, 0, 0, 0.27778],
      "730": [0, 0.69444, 0, 0, 0.66667],
      "732": [0, 0.67659, 0, 0, 0.5],
      "733": [0, 0.69444, 0, 0, 0.5],
      "915": [0, 0.69444, 0, 0, 0.54167],
      "916": [0, 0.69444, 0, 0, 0.83334],
      "920": [0, 0.69444, 0, 0, 0.77778],
      "923": [0, 0.69444, 0, 0, 0.61111],
      "926": [0, 0.69444, 0, 0, 0.66667],
      "928": [0, 0.69444, 0, 0, 0.70834],
      "931": [0, 0.69444, 0, 0, 0.72222],
      "933": [0, 0.69444, 0, 0, 0.77778],
      "934": [0, 0.69444, 0, 0, 0.72222],
      "936": [0, 0.69444, 0, 0, 0.77778],
      "937": [0, 0.69444, 0, 0, 0.72222],
      "8211": [0, 0.44444, 0.02778, 0, 0.5],
      "8212": [0, 0.44444, 0.02778, 0, 1],
      "8216": [0, 0.69444, 0, 0, 0.27778],
      "8217": [0, 0.69444, 0, 0, 0.27778],
      "8220": [0, 0.69444, 0, 0, 0.5],
      "8221": [0, 0.69444, 0, 0, 0.5]
    },
    "Script-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "65": [0, 0.7, 0.22925, 0, 0.80253],
      "66": [0, 0.7, 0.04087, 0, 0.90757],
      "67": [0, 0.7, 0.1689, 0, 0.66619],
      "68": [0, 0.7, 0.09371, 0, 0.77443],
      "69": [0, 0.7, 0.18583, 0, 0.56162],
      "70": [0, 0.7, 0.13634, 0, 0.89544],
      "71": [0, 0.7, 0.17322, 0, 0.60961],
      "72": [0, 0.7, 0.29694, 0, 0.96919],
      "73": [0, 0.7, 0.19189, 0, 0.80907],
      "74": [0.27778, 0.7, 0.19189, 0, 1.05159],
      "75": [0, 0.7, 0.31259, 0, 0.91364],
      "76": [0, 0.7, 0.19189, 0, 0.87373],
      "77": [0, 0.7, 0.15981, 0, 1.08031],
      "78": [0, 0.7, 0.3525, 0, 0.9015],
      "79": [0, 0.7, 0.08078, 0, 0.73787],
      "80": [0, 0.7, 0.08078, 0, 1.01262],
      "81": [0, 0.7, 0.03305, 0, 0.88282],
      "82": [0, 0.7, 0.06259, 0, 0.85],
      "83": [0, 0.7, 0.19189, 0, 0.86767],
      "84": [0, 0.7, 0.29087, 0, 0.74697],
      "85": [0, 0.7, 0.25815, 0, 0.79996],
      "86": [0, 0.7, 0.27523, 0, 0.62204],
      "87": [0, 0.7, 0.27523, 0, 0.80532],
      "88": [0, 0.7, 0.26006, 0, 0.94445],
      "89": [0, 0.7, 0.2939, 0, 0.70961],
      "90": [0, 0.7, 0.24037, 0, 0.8212],
      "160": [0, 0, 0, 0, 0.25]
    },
    "Size1-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.35001, 0.85, 0, 0, 0.45834],
      "41": [0.35001, 0.85, 0, 0, 0.45834],
      "47": [0.35001, 0.85, 0, 0, 0.57778],
      "91": [0.35001, 0.85, 0, 0, 0.41667],
      "92": [0.35001, 0.85, 0, 0, 0.57778],
      "93": [0.35001, 0.85, 0, 0, 0.41667],
      "123": [0.35001, 0.85, 0, 0, 0.58334],
      "125": [0.35001, 0.85, 0, 0, 0.58334],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.72222, 0, 0, 0.55556],
      "732": [0, 0.72222, 0, 0, 0.55556],
      "770": [0, 0.72222, 0, 0, 0.55556],
      "771": [0, 0.72222, 0, 0, 0.55556],
      "8214": [-99e-5, 0.601, 0, 0, 0.77778],
      "8593": [1e-5, 0.6, 0, 0, 0.66667],
      "8595": [1e-5, 0.6, 0, 0, 0.66667],
      "8657": [1e-5, 0.6, 0, 0, 0.77778],
      "8659": [1e-5, 0.6, 0, 0, 0.77778],
      "8719": [0.25001, 0.75, 0, 0, 0.94445],
      "8720": [0.25001, 0.75, 0, 0, 0.94445],
      "8721": [0.25001, 0.75, 0, 0, 1.05556],
      "8730": [0.35001, 0.85, 0, 0, 1],
      "8739": [-599e-5, 0.606, 0, 0, 0.33333],
      "8741": [-599e-5, 0.606, 0, 0, 0.55556],
      "8747": [0.30612, 0.805, 0.19445, 0, 0.47222],
      "8748": [0.306, 0.805, 0.19445, 0, 0.47222],
      "8749": [0.306, 0.805, 0.19445, 0, 0.47222],
      "8750": [0.30612, 0.805, 0.19445, 0, 0.47222],
      "8896": [0.25001, 0.75, 0, 0, 0.83334],
      "8897": [0.25001, 0.75, 0, 0, 0.83334],
      "8898": [0.25001, 0.75, 0, 0, 0.83334],
      "8899": [0.25001, 0.75, 0, 0, 0.83334],
      "8968": [0.35001, 0.85, 0, 0, 0.47222],
      "8969": [0.35001, 0.85, 0, 0, 0.47222],
      "8970": [0.35001, 0.85, 0, 0, 0.47222],
      "8971": [0.35001, 0.85, 0, 0, 0.47222],
      "9168": [-99e-5, 0.601, 0, 0, 0.66667],
      "10216": [0.35001, 0.85, 0, 0, 0.47222],
      "10217": [0.35001, 0.85, 0, 0, 0.47222],
      "10752": [0.25001, 0.75, 0, 0, 1.11111],
      "10753": [0.25001, 0.75, 0, 0, 1.11111],
      "10754": [0.25001, 0.75, 0, 0, 1.11111],
      "10756": [0.25001, 0.75, 0, 0, 0.83334],
      "10758": [0.25001, 0.75, 0, 0, 0.83334]
    },
    "Size2-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.65002, 1.15, 0, 0, 0.59722],
      "41": [0.65002, 1.15, 0, 0, 0.59722],
      "47": [0.65002, 1.15, 0, 0, 0.81111],
      "91": [0.65002, 1.15, 0, 0, 0.47222],
      "92": [0.65002, 1.15, 0, 0, 0.81111],
      "93": [0.65002, 1.15, 0, 0, 0.47222],
      "123": [0.65002, 1.15, 0, 0, 0.66667],
      "125": [0.65002, 1.15, 0, 0, 0.66667],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.75, 0, 0, 1],
      "732": [0, 0.75, 0, 0, 1],
      "770": [0, 0.75, 0, 0, 1],
      "771": [0, 0.75, 0, 0, 1],
      "8719": [0.55001, 1.05, 0, 0, 1.27778],
      "8720": [0.55001, 1.05, 0, 0, 1.27778],
      "8721": [0.55001, 1.05, 0, 0, 1.44445],
      "8730": [0.65002, 1.15, 0, 0, 1],
      "8747": [0.86225, 1.36, 0.44445, 0, 0.55556],
      "8748": [0.862, 1.36, 0.44445, 0, 0.55556],
      "8749": [0.862, 1.36, 0.44445, 0, 0.55556],
      "8750": [0.86225, 1.36, 0.44445, 0, 0.55556],
      "8896": [0.55001, 1.05, 0, 0, 1.11111],
      "8897": [0.55001, 1.05, 0, 0, 1.11111],
      "8898": [0.55001, 1.05, 0, 0, 1.11111],
      "8899": [0.55001, 1.05, 0, 0, 1.11111],
      "8968": [0.65002, 1.15, 0, 0, 0.52778],
      "8969": [0.65002, 1.15, 0, 0, 0.52778],
      "8970": [0.65002, 1.15, 0, 0, 0.52778],
      "8971": [0.65002, 1.15, 0, 0, 0.52778],
      "10216": [0.65002, 1.15, 0, 0, 0.61111],
      "10217": [0.65002, 1.15, 0, 0, 0.61111],
      "10752": [0.55001, 1.05, 0, 0, 1.51112],
      "10753": [0.55001, 1.05, 0, 0, 1.51112],
      "10754": [0.55001, 1.05, 0, 0, 1.51112],
      "10756": [0.55001, 1.05, 0, 0, 1.11111],
      "10758": [0.55001, 1.05, 0, 0, 1.11111]
    },
    "Size3-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [0.95003, 1.45, 0, 0, 0.73611],
      "41": [0.95003, 1.45, 0, 0, 0.73611],
      "47": [0.95003, 1.45, 0, 0, 1.04445],
      "91": [0.95003, 1.45, 0, 0, 0.52778],
      "92": [0.95003, 1.45, 0, 0, 1.04445],
      "93": [0.95003, 1.45, 0, 0, 0.52778],
      "123": [0.95003, 1.45, 0, 0, 0.75],
      "125": [0.95003, 1.45, 0, 0, 0.75],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.75, 0, 0, 1.44445],
      "732": [0, 0.75, 0, 0, 1.44445],
      "770": [0, 0.75, 0, 0, 1.44445],
      "771": [0, 0.75, 0, 0, 1.44445],
      "8730": [0.95003, 1.45, 0, 0, 1],
      "8968": [0.95003, 1.45, 0, 0, 0.58334],
      "8969": [0.95003, 1.45, 0, 0, 0.58334],
      "8970": [0.95003, 1.45, 0, 0, 0.58334],
      "8971": [0.95003, 1.45, 0, 0, 0.58334],
      "10216": [0.95003, 1.45, 0, 0, 0.75],
      "10217": [0.95003, 1.45, 0, 0, 0.75]
    },
    "Size4-Regular": {
      "32": [0, 0, 0, 0, 0.25],
      "40": [1.25003, 1.75, 0, 0, 0.79167],
      "41": [1.25003, 1.75, 0, 0, 0.79167],
      "47": [1.25003, 1.75, 0, 0, 1.27778],
      "91": [1.25003, 1.75, 0, 0, 0.58334],
      "92": [1.25003, 1.75, 0, 0, 1.27778],
      "93": [1.25003, 1.75, 0, 0, 0.58334],
      "123": [1.25003, 1.75, 0, 0, 0.80556],
      "125": [1.25003, 1.75, 0, 0, 0.80556],
      "160": [0, 0, 0, 0, 0.25],
      "710": [0, 0.825, 0, 0, 1.8889],
      "732": [0, 0.825, 0, 0, 1.8889],
      "770": [0, 0.825, 0, 0, 1.8889],
      "771": [0, 0.825, 0, 0, 1.8889],
      "8730": [1.25003, 1.75, 0, 0, 1],
      "8968": [1.25003, 1.75, 0, 0, 0.63889],
      "8969": [1.25003, 1.75, 0, 0, 0.63889],
      "8970": [1.25003, 1.75, 0, 0, 0.63889],
      "8971": [1.25003, 1.75, 0, 0, 0.63889],
      "9115": [0.64502, 1.155, 0, 0, 0.875],
      "9116": [1e-5, 0.6, 0, 0, 0.875],
      "9117": [0.64502, 1.155, 0, 0, 0.875],
      "9118": [0.64502, 1.155, 0, 0, 0.875],
      "9119": [1e-5, 0.6, 0, 0, 0.875],
      "9120": [0.64502, 1.155, 0, 0, 0.875],
      "9121": [0.64502, 1.155, 0, 0, 0.66667],
      "9122": [-99e-5, 0.601, 0, 0, 0.66667],
      "9123": [0.64502, 1.155, 0, 0, 0.66667],
      "9124": [0.64502, 1.155, 0, 0, 0.66667],
      "9125": [-99e-5, 0.601, 0, 0, 0.66667],
      "9126": [0.64502, 1.155, 0, 0, 0.66667],
      "9127": [1e-5, 0.9, 0, 0, 0.88889],
      "9128": [0.65002, 1.15, 0, 0, 0.88889],
      "9129": [0.90001, 0, 0, 0, 0.88889],
      "9130": [0, 0.3, 0, 0, 0.88889],
      "9131": [1e-5, 0.9, 0, 0, 0.88889],
      "9132": [0.65002, 1.15, 0, 0, 0.88889],
      "9133": [0.90001, 0, 0, 0, 0.88889],
      "9143": [0.88502, 0.915, 0, 0, 1.05556],
      "10216": [1.25003, 1.75, 0, 0, 0.80556],
      "10217": [1.25003, 1.75, 0, 0, 0.80556],
      "57344": [-499e-5, 0.605, 0, 0, 1.05556],
      "57345": [-499e-5, 0.605, 0, 0, 1.05556],
      "57680": [0, 0.12, 0, 0, 0.45],
      "57681": [0, 0.12, 0, 0, 0.45],
      "57682": [0, 0.12, 0, 0, 0.45],
      "57683": [0, 0.12, 0, 0, 0.45]
    },
    "Typewriter-Regular": {
      "32": [0, 0, 0, 0, 0.525],
      "33": [0, 0.61111, 0, 0, 0.525],
      "34": [0, 0.61111, 0, 0, 0.525],
      "35": [0, 0.61111, 0, 0, 0.525],
      "36": [0.08333, 0.69444, 0, 0, 0.525],
      "37": [0.08333, 0.69444, 0, 0, 0.525],
      "38": [0, 0.61111, 0, 0, 0.525],
      "39": [0, 0.61111, 0, 0, 0.525],
      "40": [0.08333, 0.69444, 0, 0, 0.525],
      "41": [0.08333, 0.69444, 0, 0, 0.525],
      "42": [0, 0.52083, 0, 0, 0.525],
      "43": [-0.08056, 0.53055, 0, 0, 0.525],
      "44": [0.13889, 0.125, 0, 0, 0.525],
      "45": [-0.08056, 0.53055, 0, 0, 0.525],
      "46": [0, 0.125, 0, 0, 0.525],
      "47": [0.08333, 0.69444, 0, 0, 0.525],
      "48": [0, 0.61111, 0, 0, 0.525],
      "49": [0, 0.61111, 0, 0, 0.525],
      "50": [0, 0.61111, 0, 0, 0.525],
      "51": [0, 0.61111, 0, 0, 0.525],
      "52": [0, 0.61111, 0, 0, 0.525],
      "53": [0, 0.61111, 0, 0, 0.525],
      "54": [0, 0.61111, 0, 0, 0.525],
      "55": [0, 0.61111, 0, 0, 0.525],
      "56": [0, 0.61111, 0, 0, 0.525],
      "57": [0, 0.61111, 0, 0, 0.525],
      "58": [0, 0.43056, 0, 0, 0.525],
      "59": [0.13889, 0.43056, 0, 0, 0.525],
      "60": [-0.05556, 0.55556, 0, 0, 0.525],
      "61": [-0.19549, 0.41562, 0, 0, 0.525],
      "62": [-0.05556, 0.55556, 0, 0, 0.525],
      "63": [0, 0.61111, 0, 0, 0.525],
      "64": [0, 0.61111, 0, 0, 0.525],
      "65": [0, 0.61111, 0, 0, 0.525],
      "66": [0, 0.61111, 0, 0, 0.525],
      "67": [0, 0.61111, 0, 0, 0.525],
      "68": [0, 0.61111, 0, 0, 0.525],
      "69": [0, 0.61111, 0, 0, 0.525],
      "70": [0, 0.61111, 0, 0, 0.525],
      "71": [0, 0.61111, 0, 0, 0.525],
      "72": [0, 0.61111, 0, 0, 0.525],
      "73": [0, 0.61111, 0, 0, 0.525],
      "74": [0, 0.61111, 0, 0, 0.525],
      "75": [0, 0.61111, 0, 0, 0.525],
      "76": [0, 0.61111, 0, 0, 0.525],
      "77": [0, 0.61111, 0, 0, 0.525],
      "78": [0, 0.61111, 0, 0, 0.525],
      "79": [0, 0.61111, 0, 0, 0.525],
      "80": [0, 0.61111, 0, 0, 0.525],
      "81": [0.13889, 0.61111, 0, 0, 0.525],
      "82": [0, 0.61111, 0, 0, 0.525],
      "83": [0, 0.61111, 0, 0, 0.525],
      "84": [0, 0.61111, 0, 0, 0.525],
      "85": [0, 0.61111, 0, 0, 0.525],
      "86": [0, 0.61111, 0, 0, 0.525],
      "87": [0, 0.61111, 0, 0, 0.525],
      "88": [0, 0.61111, 0, 0, 0.525],
      "89": [0, 0.61111, 0, 0, 0.525],
      "90": [0, 0.61111, 0, 0, 0.525],
      "91": [0.08333, 0.69444, 0, 0, 0.525],
      "92": [0.08333, 0.69444, 0, 0, 0.525],
      "93": [0.08333, 0.69444, 0, 0, 0.525],
      "94": [0, 0.61111, 0, 0, 0.525],
      "95": [0.09514, 0, 0, 0, 0.525],
      "96": [0, 0.61111, 0, 0, 0.525],
      "97": [0, 0.43056, 0, 0, 0.525],
      "98": [0, 0.61111, 0, 0, 0.525],
      "99": [0, 0.43056, 0, 0, 0.525],
      "100": [0, 0.61111, 0, 0, 0.525],
      "101": [0, 0.43056, 0, 0, 0.525],
      "102": [0, 0.61111, 0, 0, 0.525],
      "103": [0.22222, 0.43056, 0, 0, 0.525],
      "104": [0, 0.61111, 0, 0, 0.525],
      "105": [0, 0.61111, 0, 0, 0.525],
      "106": [0.22222, 0.61111, 0, 0, 0.525],
      "107": [0, 0.61111, 0, 0, 0.525],
      "108": [0, 0.61111, 0, 0, 0.525],
      "109": [0, 0.43056, 0, 0, 0.525],
      "110": [0, 0.43056, 0, 0, 0.525],
      "111": [0, 0.43056, 0, 0, 0.525],
      "112": [0.22222, 0.43056, 0, 0, 0.525],
      "113": [0.22222, 0.43056, 0, 0, 0.525],
      "114": [0, 0.43056, 0, 0, 0.525],
      "115": [0, 0.43056, 0, 0, 0.525],
      "116": [0, 0.55358, 0, 0, 0.525],
      "117": [0, 0.43056, 0, 0, 0.525],
      "118": [0, 0.43056, 0, 0, 0.525],
      "119": [0, 0.43056, 0, 0, 0.525],
      "120": [0, 0.43056, 0, 0, 0.525],
      "121": [0.22222, 0.43056, 0, 0, 0.525],
      "122": [0, 0.43056, 0, 0, 0.525],
      "123": [0.08333, 0.69444, 0, 0, 0.525],
      "124": [0.08333, 0.69444, 0, 0, 0.525],
      "125": [0.08333, 0.69444, 0, 0, 0.525],
      "126": [0, 0.61111, 0, 0, 0.525],
      "127": [0, 0.61111, 0, 0, 0.525],
      "160": [0, 0, 0, 0, 0.525],
      "176": [0, 0.61111, 0, 0, 0.525],
      "184": [0.19445, 0, 0, 0, 0.525],
      "305": [0, 0.43056, 0, 0, 0.525],
      "567": [0.22222, 0.43056, 0, 0, 0.525],
      "711": [0, 0.56597, 0, 0, 0.525],
      "713": [0, 0.56555, 0, 0, 0.525],
      "714": [0, 0.61111, 0, 0, 0.525],
      "715": [0, 0.61111, 0, 0, 0.525],
      "728": [0, 0.61111, 0, 0, 0.525],
      "730": [0, 0.61111, 0, 0, 0.525],
      "770": [0, 0.61111, 0, 0, 0.525],
      "771": [0, 0.61111, 0, 0, 0.525],
      "776": [0, 0.61111, 0, 0, 0.525],
      "915": [0, 0.61111, 0, 0, 0.525],
      "916": [0, 0.61111, 0, 0, 0.525],
      "920": [0, 0.61111, 0, 0, 0.525],
      "923": [0, 0.61111, 0, 0, 0.525],
      "926": [0, 0.61111, 0, 0, 0.525],
      "928": [0, 0.61111, 0, 0, 0.525],
      "931": [0, 0.61111, 0, 0, 0.525],
      "933": [0, 0.61111, 0, 0, 0.525],
      "934": [0, 0.61111, 0, 0, 0.525],
      "936": [0, 0.61111, 0, 0, 0.525],
      "937": [0, 0.61111, 0, 0, 0.525],
      "8216": [0, 0.61111, 0, 0, 0.525],
      "8217": [0, 0.61111, 0, 0, 0.525],
      "8242": [0, 0.61111, 0, 0, 0.525],
      "9251": [0.11111, 0.21944, 0, 0, 0.525]
    }
  };
  var sigmasAndXis = {
    slant: [0.25, 0.25, 0.25],
    // sigma1
    space: [0, 0, 0],
    // sigma2
    stretch: [0, 0, 0],
    // sigma3
    shrink: [0, 0, 0],
    // sigma4
    xHeight: [0.431, 0.431, 0.431],
    // sigma5
    quad: [1, 1.171, 1.472],
    // sigma6
    extraSpace: [0, 0, 0],
    // sigma7
    num1: [0.677, 0.732, 0.925],
    // sigma8
    num2: [0.394, 0.384, 0.387],
    // sigma9
    num3: [0.444, 0.471, 0.504],
    // sigma10
    denom1: [0.686, 0.752, 1.025],
    // sigma11
    denom2: [0.345, 0.344, 0.532],
    // sigma12
    sup1: [0.413, 0.503, 0.504],
    // sigma13
    sup2: [0.363, 0.431, 0.404],
    // sigma14
    sup3: [0.289, 0.286, 0.294],
    // sigma15
    sub1: [0.15, 0.143, 0.2],
    // sigma16
    sub2: [0.247, 0.286, 0.4],
    // sigma17
    supDrop: [0.386, 0.353, 0.494],
    // sigma18
    subDrop: [0.05, 0.071, 0.1],
    // sigma19
    delim1: [2.39, 1.7, 1.98],
    // sigma20
    delim2: [1.01, 1.157, 1.42],
    // sigma21
    axisHeight: [0.25, 0.25, 0.25],
    // sigma22
    // These font metrics are extracted from TeX by using tftopl on cmex10.tfm;
    // they correspond to the font parameters of the extension fonts (family 3).
    // See the TeXbook, page 441. In AMSTeX, the extension fonts scale; to
    // match cmex7, we'd use cmex7.tfm values for script and scriptscript
    // values.
    defaultRuleThickness: [0.04, 0.049, 0.049],
    // xi8; cmex7: 0.049
    bigOpSpacing1: [0.111, 0.111, 0.111],
    // xi9
    bigOpSpacing2: [0.166, 0.166, 0.166],
    // xi10
    bigOpSpacing3: [0.2, 0.2, 0.2],
    // xi11
    bigOpSpacing4: [0.6, 0.611, 0.611],
    // xi12; cmex7: 0.611
    bigOpSpacing5: [0.1, 0.143, 0.143],
    // xi13; cmex7: 0.143
    // The \sqrt rule width is taken from the height of the surd character.
    // Since we use the same font at all sizes, this thickness doesn't scale.
    sqrtRuleThickness: [0.04, 0.04, 0.04],
    // This value determines how large a pt is, for metrics which are defined
    // in terms of pts.
    // This value is also used in katex.scss; if you change it make sure the
    // values match.
    ptPerEm: [10, 10, 10],
    // The space between adjacent `|` columns in an array definition. From
    // `\showthe\doublerulesep` in LaTeX. Equals 2.0 / ptPerEm.
    doubleRuleSep: [0.2, 0.2, 0.2],
    // The width of separator lines in {array} environments. From
    // `\showthe\arrayrulewidth` in LaTeX. Equals 0.4 / ptPerEm.
    arrayRuleWidth: [0.04, 0.04, 0.04],
    // Two values from LaTeX source2e:
    fboxsep: [0.3, 0.3, 0.3],
    //        3 pt / ptPerEm
    fboxrule: [0.04, 0.04, 0.04]
    // 0.4 pt / ptPerEm
  };
  var extraCharacterMap = {
    // Latin-1
    "\xC5": "A",
    "\xD0": "D",
    "\xDE": "o",
    "\xE5": "a",
    "\xF0": "d",
    "\xFE": "o",
    // Cyrillic
    "\u0410": "A",
    "\u0411": "B",
    "\u0412": "B",
    "\u0413": "F",
    "\u0414": "A",
    "\u0415": "E",
    "\u0416": "K",
    "\u0417": "3",
    "\u0418": "N",
    "\u0419": "N",
    "\u041A": "K",
    "\u041B": "N",
    "\u041C": "M",
    "\u041D": "H",
    "\u041E": "O",
    "\u041F": "N",
    "\u0420": "P",
    "\u0421": "C",
    "\u0422": "T",
    "\u0423": "y",
    "\u0424": "O",
    "\u0425": "X",
    "\u0426": "U",
    "\u0427": "h",
    "\u0428": "W",
    "\u0429": "W",
    "\u042A": "B",
    "\u042B": "X",
    "\u042C": "B",
    "\u042D": "3",
    "\u042E": "X",
    "\u042F": "R",
    "\u0430": "a",
    "\u0431": "b",
    "\u0432": "a",
    "\u0433": "r",
    "\u0434": "y",
    "\u0435": "e",
    "\u0436": "m",
    "\u0437": "e",
    "\u0438": "n",
    "\u0439": "n",
    "\u043A": "n",
    "\u043B": "n",
    "\u043C": "m",
    "\u043D": "n",
    "\u043E": "o",
    "\u043F": "n",
    "\u0440": "p",
    "\u0441": "c",
    "\u0442": "o",
    "\u0443": "y",
    "\u0444": "b",
    "\u0445": "x",
    "\u0446": "n",
    "\u0447": "n",
    "\u0448": "w",
    "\u0449": "w",
    "\u044A": "a",
    "\u044B": "m",
    "\u044C": "a",
    "\u044D": "e",
    "\u044E": "m",
    "\u044F": "r"
  };
  function setFontMetrics(fontName, metrics) {
    fontMetricsData[fontName] = metrics;
  }
  function getCharacterMetrics(character, font, mode) {
    if (!fontMetricsData[font]) {
      throw new Error("Font metrics not found for font: " + font + ".");
    }
    var ch = character.charCodeAt(0);
    var metrics = fontMetricsData[font][ch];
    if (!metrics && character[0] in extraCharacterMap) {
      ch = extraCharacterMap[character[0]].charCodeAt(0);
      metrics = fontMetricsData[font][ch];
    }
    if (!metrics && mode === "text") {
      if (supportedCodepoint(ch)) {
        metrics = fontMetricsData[font][77];
      }
    }
    if (metrics) {
      return {
        depth: metrics[0],
        height: metrics[1],
        italic: metrics[2],
        skew: metrics[3],
        width: metrics[4]
      };
    }
  }
  var fontMetricsBySizeIndex = {};
  function getGlobalMetrics(size) {
    var sizeIndex;
    if (size >= 5) {
      sizeIndex = 0;
    } else if (size >= 3) {
      sizeIndex = 1;
    } else {
      sizeIndex = 2;
    }
    if (!fontMetricsBySizeIndex[sizeIndex]) {
      var metrics = fontMetricsBySizeIndex[sizeIndex] = {
        cssEmPerMu: sigmasAndXis.quad[sizeIndex] / 18
      };
      for (var key in sigmasAndXis) {
        if (sigmasAndXis.hasOwnProperty(key)) {
          metrics[key] = sigmasAndXis[key][sizeIndex];
        }
      }
    }
    return fontMetricsBySizeIndex[sizeIndex];
  }
  var symbols = {
    "math": {},
    "text": {}
  };
  function defineSymbol(mode, font, group, replace, name, acceptUnicodeChar) {
    symbols[mode][name] = {
      font,
      group,
      replace
    };
    if (acceptUnicodeChar && replace) {
      symbols[mode][replace] = symbols[mode][name];
    }
  }
  var math2 = "math";
  var text3 = "text";
  var main = "main";
  var ams = "ams";
  var accent = "accent-token";
  var bin = "bin";
  var close = "close";
  var inner = "inner";
  var mathord = "mathord";
  var op = "op-token";
  var open = "open";
  var punct = "punct";
  var rel = "rel";
  var spacing = "spacing";
  var textord = "textord";
  defineSymbol(math2, main, rel, "\u2261", "\\equiv", true);
  defineSymbol(math2, main, rel, "\u227A", "\\prec", true);
  defineSymbol(math2, main, rel, "\u227B", "\\succ", true);
  defineSymbol(math2, main, rel, "\u223C", "\\sim", true);
  defineSymbol(math2, main, rel, "\u22A5", "\\perp");
  defineSymbol(math2, main, rel, "\u2AAF", "\\preceq", true);
  defineSymbol(math2, main, rel, "\u2AB0", "\\succeq", true);
  defineSymbol(math2, main, rel, "\u2243", "\\simeq", true);
  defineSymbol(math2, main, rel, "\u2223", "\\mid", true);
  defineSymbol(math2, main, rel, "\u226A", "\\ll", true);
  defineSymbol(math2, main, rel, "\u226B", "\\gg", true);
  defineSymbol(math2, main, rel, "\u224D", "\\asymp", true);
  defineSymbol(math2, main, rel, "\u2225", "\\parallel");
  defineSymbol(math2, main, rel, "\u22C8", "\\bowtie", true);
  defineSymbol(math2, main, rel, "\u2323", "\\smile", true);
  defineSymbol(math2, main, rel, "\u2291", "\\sqsubseteq", true);
  defineSymbol(math2, main, rel, "\u2292", "\\sqsupseteq", true);
  defineSymbol(math2, main, rel, "\u2250", "\\doteq", true);
  defineSymbol(math2, main, rel, "\u2322", "\\frown", true);
  defineSymbol(math2, main, rel, "\u220B", "\\ni", true);
  defineSymbol(math2, main, rel, "\u221D", "\\propto", true);
  defineSymbol(math2, main, rel, "\u22A2", "\\vdash", true);
  defineSymbol(math2, main, rel, "\u22A3", "\\dashv", true);
  defineSymbol(math2, main, rel, "\u220B", "\\owns");
  defineSymbol(math2, main, punct, ".", "\\ldotp");
  defineSymbol(math2, main, punct, "\u22C5", "\\cdotp");
  defineSymbol(math2, main, punct, "\u22C5", "\xB7");
  defineSymbol(text3, main, textord, "\u22C5", "\xB7");
  defineSymbol(math2, main, textord, "#", "\\#");
  defineSymbol(text3, main, textord, "#", "\\#");
  defineSymbol(math2, main, textord, "&", "\\&");
  defineSymbol(text3, main, textord, "&", "\\&");
  defineSymbol(math2, main, textord, "\u2135", "\\aleph", true);
  defineSymbol(math2, main, textord, "\u2200", "\\forall", true);
  defineSymbol(math2, main, textord, "\u210F", "\\hbar", true);
  defineSymbol(math2, main, textord, "\u2203", "\\exists", true);
  defineSymbol(math2, main, textord, "\u2207", "\\nabla", true);
  defineSymbol(math2, main, textord, "\u266D", "\\flat", true);
  defineSymbol(math2, main, textord, "\u2113", "\\ell", true);
  defineSymbol(math2, main, textord, "\u266E", "\\natural", true);
  defineSymbol(math2, main, textord, "\u2663", "\\clubsuit", true);
  defineSymbol(math2, main, textord, "\u2118", "\\wp", true);
  defineSymbol(math2, main, textord, "\u266F", "\\sharp", true);
  defineSymbol(math2, main, textord, "\u2662", "\\diamondsuit", true);
  defineSymbol(math2, main, textord, "\u211C", "\\Re", true);
  defineSymbol(math2, main, textord, "\u2661", "\\heartsuit", true);
  defineSymbol(math2, main, textord, "\u2111", "\\Im", true);
  defineSymbol(math2, main, textord, "\u2660", "\\spadesuit", true);
  defineSymbol(math2, main, textord, "\xA7", "\\S", true);
  defineSymbol(text3, main, textord, "\xA7", "\\S");
  defineSymbol(math2, main, textord, "\xB6", "\\P", true);
  defineSymbol(text3, main, textord, "\xB6", "\\P");
  defineSymbol(math2, main, textord, "\u2020", "\\dag");
  defineSymbol(text3, main, textord, "\u2020", "\\dag");
  defineSymbol(text3, main, textord, "\u2020", "\\textdagger");
  defineSymbol(math2, main, textord, "\u2021", "\\ddag");
  defineSymbol(text3, main, textord, "\u2021", "\\ddag");
  defineSymbol(text3, main, textord, "\u2021", "\\textdaggerdbl");
  defineSymbol(math2, main, close, "\u23B1", "\\rmoustache", true);
  defineSymbol(math2, main, open, "\u23B0", "\\lmoustache", true);
  defineSymbol(math2, main, close, "\u27EF", "\\rgroup", true);
  defineSymbol(math2, main, open, "\u27EE", "\\lgroup", true);
  defineSymbol(math2, main, bin, "\u2213", "\\mp", true);
  defineSymbol(math2, main, bin, "\u2296", "\\ominus", true);
  defineSymbol(math2, main, bin, "\u228E", "\\uplus", true);
  defineSymbol(math2, main, bin, "\u2293", "\\sqcap", true);
  defineSymbol(math2, main, bin, "\u2217", "\\ast");
  defineSymbol(math2, main, bin, "\u2294", "\\sqcup", true);
  defineSymbol(math2, main, bin, "\u25EF", "\\bigcirc", true);
  defineSymbol(math2, main, bin, "\u2219", "\\bullet", true);
  defineSymbol(math2, main, bin, "\u2021", "\\ddagger");
  defineSymbol(math2, main, bin, "\u2240", "\\wr", true);
  defineSymbol(math2, main, bin, "\u2A3F", "\\amalg");
  defineSymbol(math2, main, bin, "&", "\\And");
  defineSymbol(math2, main, rel, "\u27F5", "\\longleftarrow", true);
  defineSymbol(math2, main, rel, "\u21D0", "\\Leftarrow", true);
  defineSymbol(math2, main, rel, "\u27F8", "\\Longleftarrow", true);
  defineSymbol(math2, main, rel, "\u27F6", "\\longrightarrow", true);
  defineSymbol(math2, main, rel, "\u21D2", "\\Rightarrow", true);
  defineSymbol(math2, main, rel, "\u27F9", "\\Longrightarrow", true);
  defineSymbol(math2, main, rel, "\u2194", "\\leftrightarrow", true);
  defineSymbol(math2, main, rel, "\u27F7", "\\longleftrightarrow", true);
  defineSymbol(math2, main, rel, "\u21D4", "\\Leftrightarrow", true);
  defineSymbol(math2, main, rel, "\u27FA", "\\Longleftrightarrow", true);
  defineSymbol(math2, main, rel, "\u21A6", "\\mapsto", true);
  defineSymbol(math2, main, rel, "\u27FC", "\\longmapsto", true);
  defineSymbol(math2, main, rel, "\u2197", "\\nearrow", true);
  defineSymbol(math2, main, rel, "\u21A9", "\\hookleftarrow", true);
  defineSymbol(math2, main, rel, "\u21AA", "\\hookrightarrow", true);
  defineSymbol(math2, main, rel, "\u2198", "\\searrow", true);
  defineSymbol(math2, main, rel, "\u21BC", "\\leftharpoonup", true);
  defineSymbol(math2, main, rel, "\u21C0", "\\rightharpoonup", true);
  defineSymbol(math2, main, rel, "\u2199", "\\swarrow", true);
  defineSymbol(math2, main, rel, "\u21BD", "\\leftharpoondown", true);
  defineSymbol(math2, main, rel, "\u21C1", "\\rightharpoondown", true);
  defineSymbol(math2, main, rel, "\u2196", "\\nwarrow", true);
  defineSymbol(math2, main, rel, "\u21CC", "\\rightleftharpoons", true);
  defineSymbol(math2, ams, rel, "\u226E", "\\nless", true);
  defineSymbol(math2, ams, rel, "\uE010", "\\@nleqslant");
  defineSymbol(math2, ams, rel, "\uE011", "\\@nleqq");
  defineSymbol(math2, ams, rel, "\u2A87", "\\lneq", true);
  defineSymbol(math2, ams, rel, "\u2268", "\\lneqq", true);
  defineSymbol(math2, ams, rel, "\uE00C", "\\@lvertneqq");
  defineSymbol(math2, ams, rel, "\u22E6", "\\lnsim", true);
  defineSymbol(math2, ams, rel, "\u2A89", "\\lnapprox", true);
  defineSymbol(math2, ams, rel, "\u2280", "\\nprec", true);
  defineSymbol(math2, ams, rel, "\u22E0", "\\npreceq", true);
  defineSymbol(math2, ams, rel, "\u22E8", "\\precnsim", true);
  defineSymbol(math2, ams, rel, "\u2AB9", "\\precnapprox", true);
  defineSymbol(math2, ams, rel, "\u2241", "\\nsim", true);
  defineSymbol(math2, ams, rel, "\uE006", "\\@nshortmid");
  defineSymbol(math2, ams, rel, "\u2224", "\\nmid", true);
  defineSymbol(math2, ams, rel, "\u22AC", "\\nvdash", true);
  defineSymbol(math2, ams, rel, "\u22AD", "\\nvDash", true);
  defineSymbol(math2, ams, rel, "\u22EA", "\\ntriangleleft");
  defineSymbol(math2, ams, rel, "\u22EC", "\\ntrianglelefteq", true);
  defineSymbol(math2, ams, rel, "\u228A", "\\subsetneq", true);
  defineSymbol(math2, ams, rel, "\uE01A", "\\@varsubsetneq");
  defineSymbol(math2, ams, rel, "\u2ACB", "\\subsetneqq", true);
  defineSymbol(math2, ams, rel, "\uE017", "\\@varsubsetneqq");
  defineSymbol(math2, ams, rel, "\u226F", "\\ngtr", true);
  defineSymbol(math2, ams, rel, "\uE00F", "\\@ngeqslant");
  defineSymbol(math2, ams, rel, "\uE00E", "\\@ngeqq");
  defineSymbol(math2, ams, rel, "\u2A88", "\\gneq", true);
  defineSymbol(math2, ams, rel, "\u2269", "\\gneqq", true);
  defineSymbol(math2, ams, rel, "\uE00D", "\\@gvertneqq");
  defineSymbol(math2, ams, rel, "\u22E7", "\\gnsim", true);
  defineSymbol(math2, ams, rel, "\u2A8A", "\\gnapprox", true);
  defineSymbol(math2, ams, rel, "\u2281", "\\nsucc", true);
  defineSymbol(math2, ams, rel, "\u22E1", "\\nsucceq", true);
  defineSymbol(math2, ams, rel, "\u22E9", "\\succnsim", true);
  defineSymbol(math2, ams, rel, "\u2ABA", "\\succnapprox", true);
  defineSymbol(math2, ams, rel, "\u2246", "\\ncong", true);
  defineSymbol(math2, ams, rel, "\uE007", "\\@nshortparallel");
  defineSymbol(math2, ams, rel, "\u2226", "\\nparallel", true);
  defineSymbol(math2, ams, rel, "\u22AF", "\\nVDash", true);
  defineSymbol(math2, ams, rel, "\u22EB", "\\ntriangleright");
  defineSymbol(math2, ams, rel, "\u22ED", "\\ntrianglerighteq", true);
  defineSymbol(math2, ams, rel, "\uE018", "\\@nsupseteqq");
  defineSymbol(math2, ams, rel, "\u228B", "\\supsetneq", true);
  defineSymbol(math2, ams, rel, "\uE01B", "\\@varsupsetneq");
  defineSymbol(math2, ams, rel, "\u2ACC", "\\supsetneqq", true);
  defineSymbol(math2, ams, rel, "\uE019", "\\@varsupsetneqq");
  defineSymbol(math2, ams, rel, "\u22AE", "\\nVdash", true);
  defineSymbol(math2, ams, rel, "\u2AB5", "\\precneqq", true);
  defineSymbol(math2, ams, rel, "\u2AB6", "\\succneqq", true);
  defineSymbol(math2, ams, rel, "\uE016", "\\@nsubseteqq");
  defineSymbol(math2, ams, bin, "\u22B4", "\\unlhd");
  defineSymbol(math2, ams, bin, "\u22B5", "\\unrhd");
  defineSymbol(math2, ams, rel, "\u219A", "\\nleftarrow", true);
  defineSymbol(math2, ams, rel, "\u219B", "\\nrightarrow", true);
  defineSymbol(math2, ams, rel, "\u21CD", "\\nLeftarrow", true);
  defineSymbol(math2, ams, rel, "\u21CF", "\\nRightarrow", true);
  defineSymbol(math2, ams, rel, "\u21AE", "\\nleftrightarrow", true);
  defineSymbol(math2, ams, rel, "\u21CE", "\\nLeftrightarrow", true);
  defineSymbol(math2, ams, rel, "\u25B3", "\\vartriangle");
  defineSymbol(math2, ams, textord, "\u210F", "\\hslash");
  defineSymbol(math2, ams, textord, "\u25BD", "\\triangledown");
  defineSymbol(math2, ams, textord, "\u25CA", "\\lozenge");
  defineSymbol(math2, ams, textord, "\u24C8", "\\circledS");
  defineSymbol(math2, ams, textord, "\xAE", "\\circledR");
  defineSymbol(text3, ams, textord, "\xAE", "\\circledR");
  defineSymbol(math2, ams, textord, "\u2221", "\\measuredangle", true);
  defineSymbol(math2, ams, textord, "\u2204", "\\nexists");
  defineSymbol(math2, ams, textord, "\u2127", "\\mho");
  defineSymbol(math2, ams, textord, "\u2132", "\\Finv", true);
  defineSymbol(math2, ams, textord, "\u2141", "\\Game", true);
  defineSymbol(math2, ams, textord, "\u2035", "\\backprime");
  defineSymbol(math2, ams, textord, "\u25B2", "\\blacktriangle");
  defineSymbol(math2, ams, textord, "\u25BC", "\\blacktriangledown");
  defineSymbol(math2, ams, textord, "\u25A0", "\\blacksquare");
  defineSymbol(math2, ams, textord, "\u29EB", "\\blacklozenge");
  defineSymbol(math2, ams, textord, "\u2605", "\\bigstar");
  defineSymbol(math2, ams, textord, "\u2222", "\\sphericalangle", true);
  defineSymbol(math2, ams, textord, "\u2201", "\\complement", true);
  defineSymbol(math2, ams, textord, "\xF0", "\\eth", true);
  defineSymbol(text3, main, textord, "\xF0", "\xF0");
  defineSymbol(math2, ams, textord, "\u2571", "\\diagup");
  defineSymbol(math2, ams, textord, "\u2572", "\\diagdown");
  defineSymbol(math2, ams, textord, "\u25A1", "\\square");
  defineSymbol(math2, ams, textord, "\u25A1", "\\Box");
  defineSymbol(math2, ams, textord, "\u25CA", "\\Diamond");
  defineSymbol(math2, ams, textord, "\xA5", "\\yen", true);
  defineSymbol(text3, ams, textord, "\xA5", "\\yen", true);
  defineSymbol(math2, ams, textord, "\u2713", "\\checkmark", true);
  defineSymbol(text3, ams, textord, "\u2713", "\\checkmark");
  defineSymbol(math2, ams, textord, "\u2136", "\\beth", true);
  defineSymbol(math2, ams, textord, "\u2138", "\\daleth", true);
  defineSymbol(math2, ams, textord, "\u2137", "\\gimel", true);
  defineSymbol(math2, ams, textord, "\u03DD", "\\digamma", true);
  defineSymbol(math2, ams, textord, "\u03F0", "\\varkappa");
  defineSymbol(math2, ams, open, "\u250C", "\\@ulcorner", true);
  defineSymbol(math2, ams, close, "\u2510", "\\@urcorner", true);
  defineSymbol(math2, ams, open, "\u2514", "\\@llcorner", true);
  defineSymbol(math2, ams, close, "\u2518", "\\@lrcorner", true);
  defineSymbol(math2, ams, rel, "\u2266", "\\leqq", true);
  defineSymbol(math2, ams, rel, "\u2A7D", "\\leqslant", true);
  defineSymbol(math2, ams, rel, "\u2A95", "\\eqslantless", true);
  defineSymbol(math2, ams, rel, "\u2272", "\\lesssim", true);
  defineSymbol(math2, ams, rel, "\u2A85", "\\lessapprox", true);
  defineSymbol(math2, ams, rel, "\u224A", "\\approxeq", true);
  defineSymbol(math2, ams, bin, "\u22D6", "\\lessdot");
  defineSymbol(math2, ams, rel, "\u22D8", "\\lll", true);
  defineSymbol(math2, ams, rel, "\u2276", "\\lessgtr", true);
  defineSymbol(math2, ams, rel, "\u22DA", "\\lesseqgtr", true);
  defineSymbol(math2, ams, rel, "\u2A8B", "\\lesseqqgtr", true);
  defineSymbol(math2, ams, rel, "\u2251", "\\doteqdot");
  defineSymbol(math2, ams, rel, "\u2253", "\\risingdotseq", true);
  defineSymbol(math2, ams, rel, "\u2252", "\\fallingdotseq", true);
  defineSymbol(math2, ams, rel, "\u223D", "\\backsim", true);
  defineSymbol(math2, ams, rel, "\u22CD", "\\backsimeq", true);
  defineSymbol(math2, ams, rel, "\u2AC5", "\\subseteqq", true);
  defineSymbol(math2, ams, rel, "\u22D0", "\\Subset", true);
  defineSymbol(math2, ams, rel, "\u228F", "\\sqsubset", true);
  defineSymbol(math2, ams, rel, "\u227C", "\\preccurlyeq", true);
  defineSymbol(math2, ams, rel, "\u22DE", "\\curlyeqprec", true);
  defineSymbol(math2, ams, rel, "\u227E", "\\precsim", true);
  defineSymbol(math2, ams, rel, "\u2AB7", "\\precapprox", true);
  defineSymbol(math2, ams, rel, "\u22B2", "\\vartriangleleft");
  defineSymbol(math2, ams, rel, "\u22B4", "\\trianglelefteq");
  defineSymbol(math2, ams, rel, "\u22A8", "\\vDash", true);
  defineSymbol(math2, ams, rel, "\u22AA", "\\Vvdash", true);
  defineSymbol(math2, ams, rel, "\u2323", "\\smallsmile");
  defineSymbol(math2, ams, rel, "\u2322", "\\smallfrown");
  defineSymbol(math2, ams, rel, "\u224F", "\\bumpeq", true);
  defineSymbol(math2, ams, rel, "\u224E", "\\Bumpeq", true);
  defineSymbol(math2, ams, rel, "\u2267", "\\geqq", true);
  defineSymbol(math2, ams, rel, "\u2A7E", "\\geqslant", true);
  defineSymbol(math2, ams, rel, "\u2A96", "\\eqslantgtr", true);
  defineSymbol(math2, ams, rel, "\u2273", "\\gtrsim", true);
  defineSymbol(math2, ams, rel, "\u2A86", "\\gtrapprox", true);
  defineSymbol(math2, ams, bin, "\u22D7", "\\gtrdot");
  defineSymbol(math2, ams, rel, "\u22D9", "\\ggg", true);
  defineSymbol(math2, ams, rel, "\u2277", "\\gtrless", true);
  defineSymbol(math2, ams, rel, "\u22DB", "\\gtreqless", true);
  defineSymbol(math2, ams, rel, "\u2A8C", "\\gtreqqless", true);
  defineSymbol(math2, ams, rel, "\u2256", "\\eqcirc", true);
  defineSymbol(math2, ams, rel, "\u2257", "\\circeq", true);
  defineSymbol(math2, ams, rel, "\u225C", "\\triangleq", true);
  defineSymbol(math2, ams, rel, "\u223C", "\\thicksim");
  defineSymbol(math2, ams, rel, "\u2248", "\\thickapprox");
  defineSymbol(math2, ams, rel, "\u2AC6", "\\supseteqq", true);
  defineSymbol(math2, ams, rel, "\u22D1", "\\Supset", true);
  defineSymbol(math2, ams, rel, "\u2290", "\\sqsupset", true);
  defineSymbol(math2, ams, rel, "\u227D", "\\succcurlyeq", true);
  defineSymbol(math2, ams, rel, "\u22DF", "\\curlyeqsucc", true);
  defineSymbol(math2, ams, rel, "\u227F", "\\succsim", true);
  defineSymbol(math2, ams, rel, "\u2AB8", "\\succapprox", true);
  defineSymbol(math2, ams, rel, "\u22B3", "\\vartriangleright");
  defineSymbol(math2, ams, rel, "\u22B5", "\\trianglerighteq");
  defineSymbol(math2, ams, rel, "\u22A9", "\\Vdash", true);
  defineSymbol(math2, ams, rel, "\u2223", "\\shortmid");
  defineSymbol(math2, ams, rel, "\u2225", "\\shortparallel");
  defineSymbol(math2, ams, rel, "\u226C", "\\between", true);
  defineSymbol(math2, ams, rel, "\u22D4", "\\pitchfork", true);
  defineSymbol(math2, ams, rel, "\u221D", "\\varpropto");
  defineSymbol(math2, ams, rel, "\u25C0", "\\blacktriangleleft");
  defineSymbol(math2, ams, rel, "\u2234", "\\therefore", true);
  defineSymbol(math2, ams, rel, "\u220D", "\\backepsilon");
  defineSymbol(math2, ams, rel, "\u25B6", "\\blacktriangleright");
  defineSymbol(math2, ams, rel, "\u2235", "\\because", true);
  defineSymbol(math2, ams, rel, "\u22D8", "\\llless");
  defineSymbol(math2, ams, rel, "\u22D9", "\\gggtr");
  defineSymbol(math2, ams, bin, "\u22B2", "\\lhd");
  defineSymbol(math2, ams, bin, "\u22B3", "\\rhd");
  defineSymbol(math2, ams, rel, "\u2242", "\\eqsim", true);
  defineSymbol(math2, main, rel, "\u22C8", "\\Join");
  defineSymbol(math2, ams, rel, "\u2251", "\\Doteq", true);
  defineSymbol(math2, ams, bin, "\u2214", "\\dotplus", true);
  defineSymbol(math2, ams, bin, "\u2216", "\\smallsetminus");
  defineSymbol(math2, ams, bin, "\u22D2", "\\Cap", true);
  defineSymbol(math2, ams, bin, "\u22D3", "\\Cup", true);
  defineSymbol(math2, ams, bin, "\u2A5E", "\\doublebarwedge", true);
  defineSymbol(math2, ams, bin, "\u229F", "\\boxminus", true);
  defineSymbol(math2, ams, bin, "\u229E", "\\boxplus", true);
  defineSymbol(math2, ams, bin, "\u22C7", "\\divideontimes", true);
  defineSymbol(math2, ams, bin, "\u22C9", "\\ltimes", true);
  defineSymbol(math2, ams, bin, "\u22CA", "\\rtimes", true);
  defineSymbol(math2, ams, bin, "\u22CB", "\\leftthreetimes", true);
  defineSymbol(math2, ams, bin, "\u22CC", "\\rightthreetimes", true);
  defineSymbol(math2, ams, bin, "\u22CF", "\\curlywedge", true);
  defineSymbol(math2, ams, bin, "\u22CE", "\\curlyvee", true);
  defineSymbol(math2, ams, bin, "\u229D", "\\circleddash", true);
  defineSymbol(math2, ams, bin, "\u229B", "\\circledast", true);
  defineSymbol(math2, ams, bin, "\u22C5", "\\centerdot");
  defineSymbol(math2, ams, bin, "\u22BA", "\\intercal", true);
  defineSymbol(math2, ams, bin, "\u22D2", "\\doublecap");
  defineSymbol(math2, ams, bin, "\u22D3", "\\doublecup");
  defineSymbol(math2, ams, bin, "\u22A0", "\\boxtimes", true);
  defineSymbol(math2, ams, rel, "\u21E2", "\\dashrightarrow", true);
  defineSymbol(math2, ams, rel, "\u21E0", "\\dashleftarrow", true);
  defineSymbol(math2, ams, rel, "\u21C7", "\\leftleftarrows", true);
  defineSymbol(math2, ams, rel, "\u21C6", "\\leftrightarrows", true);
  defineSymbol(math2, ams, rel, "\u21DA", "\\Lleftarrow", true);
  defineSymbol(math2, ams, rel, "\u219E", "\\twoheadleftarrow", true);
  defineSymbol(math2, ams, rel, "\u21A2", "\\leftarrowtail", true);
  defineSymbol(math2, ams, rel, "\u21AB", "\\looparrowleft", true);
  defineSymbol(math2, ams, rel, "\u21CB", "\\leftrightharpoons", true);
  defineSymbol(math2, ams, rel, "\u21B6", "\\curvearrowleft", true);
  defineSymbol(math2, ams, rel, "\u21BA", "\\circlearrowleft", true);
  defineSymbol(math2, ams, rel, "\u21B0", "\\Lsh", true);
  defineSymbol(math2, ams, rel, "\u21C8", "\\upuparrows", true);
  defineSymbol(math2, ams, rel, "\u21BF", "\\upharpoonleft", true);
  defineSymbol(math2, ams, rel, "\u21C3", "\\downharpoonleft", true);
  defineSymbol(math2, main, rel, "\u22B6", "\\origof", true);
  defineSymbol(math2, main, rel, "\u22B7", "\\imageof", true);
  defineSymbol(math2, ams, rel, "\u22B8", "\\multimap", true);
  defineSymbol(math2, ams, rel, "\u21AD", "\\leftrightsquigarrow", true);
  defineSymbol(math2, ams, rel, "\u21C9", "\\rightrightarrows", true);
  defineSymbol(math2, ams, rel, "\u21C4", "\\rightleftarrows", true);
  defineSymbol(math2, ams, rel, "\u21A0", "\\twoheadrightarrow", true);
  defineSymbol(math2, ams, rel, "\u21A3", "\\rightarrowtail", true);
  defineSymbol(math2, ams, rel, "\u21AC", "\\looparrowright", true);
  defineSymbol(math2, ams, rel, "\u21B7", "\\curvearrowright", true);
  defineSymbol(math2, ams, rel, "\u21BB", "\\circlearrowright", true);
  defineSymbol(math2, ams, rel, "\u21B1", "\\Rsh", true);
  defineSymbol(math2, ams, rel, "\u21CA", "\\downdownarrows", true);
  defineSymbol(math2, ams, rel, "\u21BE", "\\upharpoonright", true);
  defineSymbol(math2, ams, rel, "\u21C2", "\\downharpoonright", true);
  defineSymbol(math2, ams, rel, "\u21DD", "\\rightsquigarrow", true);
  defineSymbol(math2, ams, rel, "\u21DD", "\\leadsto");
  defineSymbol(math2, ams, rel, "\u21DB", "\\Rrightarrow", true);
  defineSymbol(math2, ams, rel, "\u21BE", "\\restriction");
  defineSymbol(math2, main, textord, "\u2018", "`");
  defineSymbol(math2, main, textord, "$", "\\$");
  defineSymbol(text3, main, textord, "$", "\\$");
  defineSymbol(text3, main, textord, "$", "\\textdollar");
  defineSymbol(math2, main, textord, "%", "\\%");
  defineSymbol(text3, main, textord, "%", "\\%");
  defineSymbol(math2, main, textord, "_", "\\_");
  defineSymbol(text3, main, textord, "_", "\\_");
  defineSymbol(text3, main, textord, "_", "\\textunderscore");
  defineSymbol(math2, main, textord, "\u2220", "\\angle", true);
  defineSymbol(math2, main, textord, "\u221E", "\\infty", true);
  defineSymbol(math2, main, textord, "\u2032", "\\prime");
  defineSymbol(math2, main, textord, "\u25B3", "\\triangle");
  defineSymbol(math2, main, textord, "\u0393", "\\Gamma", true);
  defineSymbol(math2, main, textord, "\u0394", "\\Delta", true);
  defineSymbol(math2, main, textord, "\u0398", "\\Theta", true);
  defineSymbol(math2, main, textord, "\u039B", "\\Lambda", true);
  defineSymbol(math2, main, textord, "\u039E", "\\Xi", true);
  defineSymbol(math2, main, textord, "\u03A0", "\\Pi", true);
  defineSymbol(math2, main, textord, "\u03A3", "\\Sigma", true);
  defineSymbol(math2, main, textord, "\u03A5", "\\Upsilon", true);
  defineSymbol(math2, main, textord, "\u03A6", "\\Phi", true);
  defineSymbol(math2, main, textord, "\u03A8", "\\Psi", true);
  defineSymbol(math2, main, textord, "\u03A9", "\\Omega", true);
  defineSymbol(math2, main, textord, "A", "\u0391");
  defineSymbol(math2, main, textord, "B", "\u0392");
  defineSymbol(math2, main, textord, "E", "\u0395");
  defineSymbol(math2, main, textord, "Z", "\u0396");
  defineSymbol(math2, main, textord, "H", "\u0397");
  defineSymbol(math2, main, textord, "I", "\u0399");
  defineSymbol(math2, main, textord, "K", "\u039A");
  defineSymbol(math2, main, textord, "M", "\u039C");
  defineSymbol(math2, main, textord, "N", "\u039D");
  defineSymbol(math2, main, textord, "O", "\u039F");
  defineSymbol(math2, main, textord, "P", "\u03A1");
  defineSymbol(math2, main, textord, "T", "\u03A4");
  defineSymbol(math2, main, textord, "X", "\u03A7");
  defineSymbol(math2, main, textord, "\xAC", "\\neg", true);
  defineSymbol(math2, main, textord, "\xAC", "\\lnot");
  defineSymbol(math2, main, textord, "\u22A4", "\\top");
  defineSymbol(math2, main, textord, "\u22A5", "\\bot");
  defineSymbol(math2, main, textord, "\u2205", "\\emptyset");
  defineSymbol(math2, ams, textord, "\u2205", "\\varnothing");
  defineSymbol(math2, main, mathord, "\u03B1", "\\alpha", true);
  defineSymbol(math2, main, mathord, "\u03B2", "\\beta", true);
  defineSymbol(math2, main, mathord, "\u03B3", "\\gamma", true);
  defineSymbol(math2, main, mathord, "\u03B4", "\\delta", true);
  defineSymbol(math2, main, mathord, "\u03F5", "\\epsilon", true);
  defineSymbol(math2, main, mathord, "\u03B6", "\\zeta", true);
  defineSymbol(math2, main, mathord, "\u03B7", "\\eta", true);
  defineSymbol(math2, main, mathord, "\u03B8", "\\theta", true);
  defineSymbol(math2, main, mathord, "\u03B9", "\\iota", true);
  defineSymbol(math2, main, mathord, "\u03BA", "\\kappa", true);
  defineSymbol(math2, main, mathord, "\u03BB", "\\lambda", true);
  defineSymbol(math2, main, mathord, "\u03BC", "\\mu", true);
  defineSymbol(math2, main, mathord, "\u03BD", "\\nu", true);
  defineSymbol(math2, main, mathord, "\u03BE", "\\xi", true);
  defineSymbol(math2, main, mathord, "\u03BF", "\\omicron", true);
  defineSymbol(math2, main, mathord, "\u03C0", "\\pi", true);
  defineSymbol(math2, main, mathord, "\u03C1", "\\rho", true);
  defineSymbol(math2, main, mathord, "\u03C3", "\\sigma", true);
  defineSymbol(math2, main, mathord, "\u03C4", "\\tau", true);
  defineSymbol(math2, main, mathord, "\u03C5", "\\upsilon", true);
  defineSymbol(math2, main, mathord, "\u03D5", "\\phi", true);
  defineSymbol(math2, main, mathord, "\u03C7", "\\chi", true);
  defineSymbol(math2, main, mathord, "\u03C8", "\\psi", true);
  defineSymbol(math2, main, mathord, "\u03C9", "\\omega", true);
  defineSymbol(math2, main, mathord, "\u03B5", "\\varepsilon", true);
  defineSymbol(math2, main, mathord, "\u03D1", "\\vartheta", true);
  defineSymbol(math2, main, mathord, "\u03D6", "\\varpi", true);
  defineSymbol(math2, main, mathord, "\u03F1", "\\varrho", true);
  defineSymbol(math2, main, mathord, "\u03C2", "\\varsigma", true);
  defineSymbol(math2, main, mathord, "\u03C6", "\\varphi", true);
  defineSymbol(math2, main, bin, "\u2217", "*", true);
  defineSymbol(math2, main, bin, "+", "+");
  defineSymbol(math2, main, bin, "\u2212", "-", true);
  defineSymbol(math2, main, bin, "\u22C5", "\\cdot", true);
  defineSymbol(math2, main, bin, "\u2218", "\\circ", true);
  defineSymbol(math2, main, bin, "\xF7", "\\div", true);
  defineSymbol(math2, main, bin, "\xB1", "\\pm", true);
  defineSymbol(math2, main, bin, "\xD7", "\\times", true);
  defineSymbol(math2, main, bin, "\u2229", "\\cap", true);
  defineSymbol(math2, main, bin, "\u222A", "\\cup", true);
  defineSymbol(math2, main, bin, "\u2216", "\\setminus", true);
  defineSymbol(math2, main, bin, "\u2227", "\\land");
  defineSymbol(math2, main, bin, "\u2228", "\\lor");
  defineSymbol(math2, main, bin, "\u2227", "\\wedge", true);
  defineSymbol(math2, main, bin, "\u2228", "\\vee", true);
  defineSymbol(math2, main, textord, "\u221A", "\\surd");
  defineSymbol(math2, main, open, "\u27E8", "\\langle", true);
  defineSymbol(math2, main, open, "\u2223", "\\lvert");
  defineSymbol(math2, main, open, "\u2225", "\\lVert");
  defineSymbol(math2, main, close, "?", "?");
  defineSymbol(math2, main, close, "!", "!");
  defineSymbol(math2, main, close, "\u27E9", "\\rangle", true);
  defineSymbol(math2, main, close, "\u2223", "\\rvert");
  defineSymbol(math2, main, close, "\u2225", "\\rVert");
  defineSymbol(math2, main, rel, "=", "=");
  defineSymbol(math2, main, rel, ":", ":");
  defineSymbol(math2, main, rel, "\u2248", "\\approx", true);
  defineSymbol(math2, main, rel, "\u2245", "\\cong", true);
  defineSymbol(math2, main, rel, "\u2265", "\\ge");
  defineSymbol(math2, main, rel, "\u2265", "\\geq", true);
  defineSymbol(math2, main, rel, "\u2190", "\\gets");
  defineSymbol(math2, main, rel, ">", "\\gt", true);
  defineSymbol(math2, main, rel, "\u2208", "\\in", true);
  defineSymbol(math2, main, rel, "\uE020", "\\@not");
  defineSymbol(math2, main, rel, "\u2282", "\\subset", true);
  defineSymbol(math2, main, rel, "\u2283", "\\supset", true);
  defineSymbol(math2, main, rel, "\u2286", "\\subseteq", true);
  defineSymbol(math2, main, rel, "\u2287", "\\supseteq", true);
  defineSymbol(math2, ams, rel, "\u2288", "\\nsubseteq", true);
  defineSymbol(math2, ams, rel, "\u2289", "\\nsupseteq", true);
  defineSymbol(math2, main, rel, "\u22A8", "\\models");
  defineSymbol(math2, main, rel, "\u2190", "\\leftarrow", true);
  defineSymbol(math2, main, rel, "\u2264", "\\le");
  defineSymbol(math2, main, rel, "\u2264", "\\leq", true);
  defineSymbol(math2, main, rel, "<", "\\lt", true);
  defineSymbol(math2, main, rel, "\u2192", "\\rightarrow", true);
  defineSymbol(math2, main, rel, "\u2192", "\\to");
  defineSymbol(math2, ams, rel, "\u2271", "\\ngeq", true);
  defineSymbol(math2, ams, rel, "\u2270", "\\nleq", true);
  defineSymbol(math2, main, spacing, "\xA0", "\\ ");
  defineSymbol(math2, main, spacing, "\xA0", "\\space");
  defineSymbol(math2, main, spacing, "\xA0", "\\nobreakspace");
  defineSymbol(text3, main, spacing, "\xA0", "\\ ");
  defineSymbol(text3, main, spacing, "\xA0", " ");
  defineSymbol(text3, main, spacing, "\xA0", "\\space");
  defineSymbol(text3, main, spacing, "\xA0", "\\nobreakspace");
  defineSymbol(math2, main, spacing, "", "\\nobreak");
  defineSymbol(math2, main, spacing, "", "\\allowbreak");
  defineSymbol(math2, main, punct, ",", ",");
  defineSymbol(math2, main, punct, ";", ";");
  defineSymbol(math2, ams, bin, "\u22BC", "\\barwedge", true);
  defineSymbol(math2, ams, bin, "\u22BB", "\\veebar", true);
  defineSymbol(math2, main, bin, "\u2299", "\\odot", true);
  defineSymbol(math2, main, bin, "\u2295", "\\oplus", true);
  defineSymbol(math2, main, bin, "\u2297", "\\otimes", true);
  defineSymbol(math2, main, textord, "\u2202", "\\partial", true);
  defineSymbol(math2, main, bin, "\u2298", "\\oslash", true);
  defineSymbol(math2, ams, bin, "\u229A", "\\circledcirc", true);
  defineSymbol(math2, ams, bin, "\u22A1", "\\boxdot", true);
  defineSymbol(math2, main, bin, "\u25B3", "\\bigtriangleup");
  defineSymbol(math2, main, bin, "\u25BD", "\\bigtriangledown");
  defineSymbol(math2, main, bin, "\u2020", "\\dagger");
  defineSymbol(math2, main, bin, "\u22C4", "\\diamond");
  defineSymbol(math2, main, bin, "\u22C6", "\\star");
  defineSymbol(math2, main, bin, "\u25C3", "\\triangleleft");
  defineSymbol(math2, main, bin, "\u25B9", "\\triangleright");
  defineSymbol(math2, main, open, "{", "\\{");
  defineSymbol(text3, main, textord, "{", "\\{");
  defineSymbol(text3, main, textord, "{", "\\textbraceleft");
  defineSymbol(math2, main, close, "}", "\\}");
  defineSymbol(text3, main, textord, "}", "\\}");
  defineSymbol(text3, main, textord, "}", "\\textbraceright");
  defineSymbol(math2, main, open, "{", "\\lbrace");
  defineSymbol(math2, main, close, "}", "\\rbrace");
  defineSymbol(math2, main, open, "[", "\\lbrack", true);
  defineSymbol(text3, main, textord, "[", "\\lbrack", true);
  defineSymbol(math2, main, close, "]", "\\rbrack", true);
  defineSymbol(text3, main, textord, "]", "\\rbrack", true);
  defineSymbol(math2, main, open, "(", "\\lparen", true);
  defineSymbol(math2, main, close, ")", "\\rparen", true);
  defineSymbol(text3, main, textord, "<", "\\textless", true);
  defineSymbol(text3, main, textord, ">", "\\textgreater", true);
  defineSymbol(math2, main, open, "\u230A", "\\lfloor", true);
  defineSymbol(math2, main, close, "\u230B", "\\rfloor", true);
  defineSymbol(math2, main, open, "\u2308", "\\lceil", true);
  defineSymbol(math2, main, close, "\u2309", "\\rceil", true);
  defineSymbol(math2, main, textord, "\\", "\\backslash");
  defineSymbol(math2, main, textord, "\u2223", "|");
  defineSymbol(math2, main, textord, "\u2223", "\\vert");
  defineSymbol(text3, main, textord, "|", "\\textbar", true);
  defineSymbol(math2, main, textord, "\u2225", "\\|");
  defineSymbol(math2, main, textord, "\u2225", "\\Vert");
  defineSymbol(text3, main, textord, "\u2225", "\\textbardbl");
  defineSymbol(text3, main, textord, "~", "\\textasciitilde");
  defineSymbol(text3, main, textord, "\\", "\\textbackslash");
  defineSymbol(text3, main, textord, "^", "\\textasciicircum");
  defineSymbol(math2, main, rel, "\u2191", "\\uparrow", true);
  defineSymbol(math2, main, rel, "\u21D1", "\\Uparrow", true);
  defineSymbol(math2, main, rel, "\u2193", "\\downarrow", true);
  defineSymbol(math2, main, rel, "\u21D3", "\\Downarrow", true);
  defineSymbol(math2, main, rel, "\u2195", "\\updownarrow", true);
  defineSymbol(math2, main, rel, "\u21D5", "\\Updownarrow", true);
  defineSymbol(math2, main, op, "\u2210", "\\coprod");
  defineSymbol(math2, main, op, "\u22C1", "\\bigvee");
  defineSymbol(math2, main, op, "\u22C0", "\\bigwedge");
  defineSymbol(math2, main, op, "\u2A04", "\\biguplus");
  defineSymbol(math2, main, op, "\u22C2", "\\bigcap");
  defineSymbol(math2, main, op, "\u22C3", "\\bigcup");
  defineSymbol(math2, main, op, "\u222B", "\\int");
  defineSymbol(math2, main, op, "\u222B", "\\intop");
  defineSymbol(math2, main, op, "\u222C", "\\iint");
  defineSymbol(math2, main, op, "\u222D", "\\iiint");
  defineSymbol(math2, main, op, "\u220F", "\\prod");
  defineSymbol(math2, main, op, "\u2211", "\\sum");
  defineSymbol(math2, main, op, "\u2A02", "\\bigotimes");
  defineSymbol(math2, main, op, "\u2A01", "\\bigoplus");
  defineSymbol(math2, main, op, "\u2A00", "\\bigodot");
  defineSymbol(math2, main, op, "\u222E", "\\oint");
  defineSymbol(math2, main, op, "\u222F", "\\oiint");
  defineSymbol(math2, main, op, "\u2230", "\\oiiint");
  defineSymbol(math2, main, op, "\u2A06", "\\bigsqcup");
  defineSymbol(math2, main, op, "\u222B", "\\smallint");
  defineSymbol(text3, main, inner, "\u2026", "\\textellipsis");
  defineSymbol(math2, main, inner, "\u2026", "\\mathellipsis");
  defineSymbol(text3, main, inner, "\u2026", "\\ldots", true);
  defineSymbol(math2, main, inner, "\u2026", "\\ldots", true);
  defineSymbol(math2, main, inner, "\u22EF", "\\@cdots", true);
  defineSymbol(math2, main, inner, "\u22F1", "\\ddots", true);
  defineSymbol(math2, main, textord, "\u22EE", "\\varvdots");
  defineSymbol(text3, main, textord, "\u22EE", "\\varvdots");
  defineSymbol(math2, main, accent, "\u02CA", "\\acute");
  defineSymbol(math2, main, accent, "\u02CB", "\\grave");
  defineSymbol(math2, main, accent, "\xA8", "\\ddot");
  defineSymbol(math2, main, accent, "~", "\\tilde");
  defineSymbol(math2, main, accent, "\u02C9", "\\bar");
  defineSymbol(math2, main, accent, "\u02D8", "\\breve");
  defineSymbol(math2, main, accent, "\u02C7", "\\check");
  defineSymbol(math2, main, accent, "^", "\\hat");
  defineSymbol(math2, main, accent, "\u20D7", "\\vec");
  defineSymbol(math2, main, accent, "\u02D9", "\\dot");
  defineSymbol(math2, main, accent, "\u02DA", "\\mathring");
  defineSymbol(math2, main, mathord, "\uE131", "\\@imath");
  defineSymbol(math2, main, mathord, "\uE237", "\\@jmath");
  defineSymbol(math2, main, textord, "\u0131", "\u0131");
  defineSymbol(math2, main, textord, "\u0237", "\u0237");
  defineSymbol(text3, main, textord, "\u0131", "\\i", true);
  defineSymbol(text3, main, textord, "\u0237", "\\j", true);
  defineSymbol(text3, main, textord, "\xDF", "\\ss", true);
  defineSymbol(text3, main, textord, "\xE6", "\\ae", true);
  defineSymbol(text3, main, textord, "\u0153", "\\oe", true);
  defineSymbol(text3, main, textord, "\xF8", "\\o", true);
  defineSymbol(text3, main, textord, "\xC6", "\\AE", true);
  defineSymbol(text3, main, textord, "\u0152", "\\OE", true);
  defineSymbol(text3, main, textord, "\xD8", "\\O", true);
  defineSymbol(text3, main, accent, "\u02CA", "\\'");
  defineSymbol(text3, main, accent, "\u02CB", "\\`");
  defineSymbol(text3, main, accent, "\u02C6", "\\^");
  defineSymbol(text3, main, accent, "\u02DC", "\\~");
  defineSymbol(text3, main, accent, "\u02C9", "\\=");
  defineSymbol(text3, main, accent, "\u02D8", "\\u");
  defineSymbol(text3, main, accent, "\u02D9", "\\.");
  defineSymbol(text3, main, accent, "\xB8", "\\c");
  defineSymbol(text3, main, accent, "\u02DA", "\\r");
  defineSymbol(text3, main, accent, "\u02C7", "\\v");
  defineSymbol(text3, main, accent, "\xA8", '\\"');
  defineSymbol(text3, main, accent, "\u02DD", "\\H");
  defineSymbol(text3, main, accent, "\u25EF", "\\textcircled");
  var ligatures = {
    "--": true,
    "---": true,
    "``": true,
    "''": true
  };
  defineSymbol(text3, main, textord, "\u2013", "--", true);
  defineSymbol(text3, main, textord, "\u2013", "\\textendash");
  defineSymbol(text3, main, textord, "\u2014", "---", true);
  defineSymbol(text3, main, textord, "\u2014", "\\textemdash");
  defineSymbol(text3, main, textord, "\u2018", "`", true);
  defineSymbol(text3, main, textord, "\u2018", "\\textquoteleft");
  defineSymbol(text3, main, textord, "\u2019", "'", true);
  defineSymbol(text3, main, textord, "\u2019", "\\textquoteright");
  defineSymbol(text3, main, textord, "\u201C", "``", true);
  defineSymbol(text3, main, textord, "\u201C", "\\textquotedblleft");
  defineSymbol(text3, main, textord, "\u201D", "''", true);
  defineSymbol(text3, main, textord, "\u201D", "\\textquotedblright");
  defineSymbol(math2, main, textord, "\xB0", "\\degree", true);
  defineSymbol(text3, main, textord, "\xB0", "\\degree");
  defineSymbol(text3, main, textord, "\xB0", "\\textdegree", true);
  defineSymbol(math2, main, textord, "\xA3", "\\pounds");
  defineSymbol(math2, main, textord, "\xA3", "\\mathsterling", true);
  defineSymbol(text3, main, textord, "\xA3", "\\pounds");
  defineSymbol(text3, main, textord, "\xA3", "\\textsterling", true);
  defineSymbol(math2, ams, textord, "\u2720", "\\maltese");
  defineSymbol(text3, ams, textord, "\u2720", "\\maltese");
  var mathTextSymbols = '0123456789/@."';
  for (i = 0; i < mathTextSymbols.length; i++) {
    ch = mathTextSymbols.charAt(i);
    defineSymbol(math2, main, textord, ch, ch);
  }
  var ch;
  var i;
  var textSymbols = '0123456789!@*()-=+";:?/.,';
  for (_i = 0; _i < textSymbols.length; _i++) {
    _ch = textSymbols.charAt(_i);
    defineSymbol(text3, main, textord, _ch, _ch);
  }
  var _ch;
  var _i;
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (_i2 = 0; _i2 < letters.length; _i2++) {
    _ch2 = letters.charAt(_i2);
    defineSymbol(math2, main, mathord, _ch2, _ch2);
    defineSymbol(text3, main, textord, _ch2, _ch2);
  }
  var _ch2;
  var _i2;
  defineSymbol(math2, ams, textord, "C", "\u2102");
  defineSymbol(text3, ams, textord, "C", "\u2102");
  defineSymbol(math2, ams, textord, "H", "\u210D");
  defineSymbol(text3, ams, textord, "H", "\u210D");
  defineSymbol(math2, ams, textord, "N", "\u2115");
  defineSymbol(text3, ams, textord, "N", "\u2115");
  defineSymbol(math2, ams, textord, "P", "\u2119");
  defineSymbol(text3, ams, textord, "P", "\u2119");
  defineSymbol(math2, ams, textord, "Q", "\u211A");
  defineSymbol(text3, ams, textord, "Q", "\u211A");
  defineSymbol(math2, ams, textord, "R", "\u211D");
  defineSymbol(text3, ams, textord, "R", "\u211D");
  defineSymbol(math2, ams, textord, "Z", "\u2124");
  defineSymbol(text3, ams, textord, "Z", "\u2124");
  defineSymbol(math2, main, mathord, "h", "\u210E");
  defineSymbol(text3, main, mathord, "h", "\u210E");
  var wideChar;
  for (_i3 = 0; _i3 < letters.length; _i3++) {
    _ch3 = letters.charAt(_i3);
    wideChar = String.fromCharCode(55349, 56320 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56372 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56424 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56580 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56684 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56736 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56788 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56840 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    wideChar = String.fromCharCode(55349, 56944 + _i3);
    defineSymbol(math2, main, mathord, _ch3, wideChar);
    defineSymbol(text3, main, textord, _ch3, wideChar);
    if (_i3 < 26) {
      wideChar = String.fromCharCode(55349, 56632 + _i3);
      defineSymbol(math2, main, mathord, _ch3, wideChar);
      defineSymbol(text3, main, textord, _ch3, wideChar);
      wideChar = String.fromCharCode(55349, 56476 + _i3);
      defineSymbol(math2, main, mathord, _ch3, wideChar);
      defineSymbol(text3, main, textord, _ch3, wideChar);
    }
  }
  var _ch3;
  var _i3;
  wideChar = String.fromCharCode(55349, 56668);
  defineSymbol(math2, main, mathord, "k", wideChar);
  defineSymbol(text3, main, textord, "k", wideChar);
  for (_i4 = 0; _i4 < 10; _i4++) {
    _ch4 = _i4.toString();
    wideChar = String.fromCharCode(55349, 57294 + _i4);
    defineSymbol(math2, main, mathord, _ch4, wideChar);
    defineSymbol(text3, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57314 + _i4);
    defineSymbol(math2, main, mathord, _ch4, wideChar);
    defineSymbol(text3, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57324 + _i4);
    defineSymbol(math2, main, mathord, _ch4, wideChar);
    defineSymbol(text3, main, textord, _ch4, wideChar);
    wideChar = String.fromCharCode(55349, 57334 + _i4);
    defineSymbol(math2, main, mathord, _ch4, wideChar);
    defineSymbol(text3, main, textord, _ch4, wideChar);
  }
  var _ch4;
  var _i4;
  var extraLatin = "\xD0\xDE\xFE";
  for (_i5 = 0; _i5 < extraLatin.length; _i5++) {
    _ch5 = extraLatin.charAt(_i5);
    defineSymbol(math2, main, mathord, _ch5, _ch5);
    defineSymbol(text3, main, textord, _ch5, _ch5);
  }
  var _ch5;
  var _i5;
  var boldUpright = {
    mathClass: "mathbf",
    textClass: "textbf",
    font: "Main-Bold"
  };
  var italic = {
    mathClass: "mathnormal",
    textClass: "textit",
    font: "Math-Italic"
  };
  var boldItalic = {
    mathClass: "boldsymbol",
    textClass: "boldsymbol",
    font: "Main-BoldItalic"
  };
  var script = {
    mathClass: "mathscr",
    textClass: "textscr",
    font: "Script-Regular"
  };
  var noFont = {
    mathClass: "",
    textClass: "",
    font: ""
  };
  var fraktur = {
    mathClass: "mathfrak",
    textClass: "textfrak",
    font: "Fraktur-Regular"
  };
  var doubleStruck = {
    mathClass: "mathbb",
    textClass: "textbb",
    font: "AMS-Regular"
  };
  var boldFraktur = {
    mathClass: "mathboldfrak",
    textClass: "textboldfrak",
    font: "Fraktur-Regular"
  };
  var sansSerif = {
    mathClass: "mathsf",
    textClass: "textsf",
    font: "SansSerif-Regular"
  };
  var boldSansSerif = {
    mathClass: "mathboldsf",
    textClass: "textboldsf",
    font: "SansSerif-Bold"
  };
  var italicSansSerif = {
    mathClass: "mathitsf",
    textClass: "textitsf",
    font: "SansSerif-Italic"
  };
  var monospace = {
    mathClass: "mathtt",
    textClass: "texttt",
    font: "Typewriter-Regular"
  };
  var wideLatinLetterData = [
    boldUpright,
    boldUpright,
    // A-Z, a-z
    italic,
    italic,
    // A-Z, a-z
    boldItalic,
    boldItalic,
    // A-Z, a-z
    // Map fancy A-Z letters to script, not calligraphic.
    // This aligns with unicode-math and math fonts (except Cambria Math).
    script,
    noFont,
    // A-Z script, a-z — no font
    noFont,
    noFont,
    // A-Z bold script, a-z bold script — no font
    fraktur,
    fraktur,
    // A-Z, a-z
    doubleStruck,
    doubleStruck,
    // A-Z double-struck, k double-struck
    // Note that we are using a bold font, but font metrics for regular Fraktur.
    boldFraktur,
    boldFraktur,
    // A-Z, a-z
    sansSerif,
    sansSerif,
    // A-Z, a-z
    boldSansSerif,
    boldSansSerif,
    // A-Z, a-z
    italicSansSerif,
    italicSansSerif,
    // A-Z, a-z
    noFont,
    noFont,
    // A-Z bold italic sans, a-z bold italic sans - no font
    monospace,
    monospace
    // A-Z, a-z
  ];
  var wideNumeralData = [
    boldUpright,
    // 0-9
    noFont,
    // 0-9 double-struck. No KaTeX font.
    sansSerif,
    // 0-9
    boldSansSerif,
    // 0-9
    monospace
    // 0-9
  ];
  var wideCharacterFont = (wideChar2) => {
    var H2 = wideChar2.charCodeAt(0);
    var L3 = wideChar2.charCodeAt(1);
    var codePoint = (H2 - 55296) * 1024 + (L3 - 56320) + 65536;
    if (119808 <= codePoint && codePoint < 120484) {
      var i = Math.floor((codePoint - 119808) / 26);
      return wideLatinLetterData[i];
    } else if (120782 <= codePoint && codePoint <= 120831) {
      var _i = Math.floor((codePoint - 120782) / 10);
      return wideNumeralData[_i];
    } else if (codePoint === 120485 || codePoint === 120486) {
      return wideLatinLetterData[0];
    } else if (120486 < codePoint && codePoint < 120782) {
      return noFont;
    } else {
      throw new ParseError("Unsupported character: " + wideChar2);
    }
  };
  var lookupSymbol = function lookupSymbol2(value, fontName, mode) {
    if (symbols[mode][value]) {
      var replacement = symbols[mode][value].replace;
      if (replacement) {
        value = replacement;
      }
    }
    return {
      value,
      metrics: getCharacterMetrics(value, fontName, mode)
    };
  };
  var makeSymbol = function makeSymbol2(value, fontName, mode, options, classes) {
    var lookup = lookupSymbol(value, fontName, mode);
    var metrics = lookup.metrics;
    value = lookup.value;
    var symbolNode;
    if (metrics) {
      var italic2 = metrics.italic;
      if (mode === "text" || options && options.font === "mathit") {
        italic2 = 0;
      }
      symbolNode = new SymbolNode(value, metrics.height, metrics.depth, italic2, metrics.skew, metrics.width, classes);
    } else {
      typeof console !== "undefined" && console.warn("No character metrics " + ("for '" + value + "' in style '" + fontName + "' and mode '" + mode + "'"));
      symbolNode = new SymbolNode(value, 0, 0, 0, 0, 0, classes);
    }
    if (options) {
      symbolNode.maxFontSize = options.sizeMultiplier;
      if (options.style.isTight()) {
        symbolNode.classes.push("mtight");
      }
      var color = options.getColor();
      if (color) {
        symbolNode.style.color = color;
      }
    }
    return symbolNode;
  };
  var mathsym = function mathsym2(value, mode, options, classes) {
    if (classes === void 0) {
      classes = [];
    }
    if (options.font === "boldsymbol" && lookupSymbol(value, "Main-Bold", mode).metrics) {
      return makeSymbol(value, "Main-Bold", mode, options, classes.concat(["mathbf"]));
    } else if (value === "\\" || symbols[mode][value].font === "main") {
      return makeSymbol(value, "Main-Regular", mode, options, classes);
    } else {
      return makeSymbol(value, "AMS-Regular", mode, options, classes.concat(["amsrm"]));
    }
  };
  var boldSymbol = function boldSymbol2(value, mode, type) {
    if (type !== "textord" && lookupSymbol(value, "Math-BoldItalic", mode).metrics) {
      return {
        fontName: "Math-BoldItalic",
        fontClass: "boldsymbol"
      };
    } else {
      return {
        fontName: "Main-Bold",
        fontClass: "mathbf"
      };
    }
  };
  var makeOrd = function makeOrd2(group, options, type) {
    var mode = group.mode;
    var text4 = group.text;
    var classes = ["mord"];
    var {
      font,
      fontFamily,
      fontWeight,
      fontShape
    } = options;
    var useFont = mode === "math" || mode === "text" && !!font;
    var fontOrFamily = useFont ? font : fontFamily;
    var wideFontName = "";
    var wideFontClass = "";
    if (text4.charCodeAt(0) === 55349) {
      var wideCharData = wideCharacterFont(text4);
      wideFontName = wideCharData.font;
      wideFontClass = wideCharData[mode + "Class"];
    }
    if (wideFontName) {
      return makeSymbol(text4, wideFontName, mode, options, classes.concat(wideFontClass));
    } else if (fontOrFamily) {
      var fontName;
      var fontClasses;
      if (fontOrFamily === "boldsymbol") {
        var fontData = boldSymbol(text4, mode, type);
        fontName = fontData.fontName;
        fontClasses = [fontData.fontClass];
      } else if (useFont) {
        fontName = fontMap[font].fontName;
        fontClasses = [font];
      } else {
        fontName = retrieveTextFontName(fontFamily, fontWeight, fontShape);
        fontClasses = [fontFamily, fontWeight, fontShape];
      }
      if (lookupSymbol(text4, fontName, mode).metrics) {
        return makeSymbol(text4, fontName, mode, options, classes.concat(fontClasses));
      } else if (ligatures.hasOwnProperty(text4) && fontName.slice(0, 10) === "Typewriter") {
        var parts = [];
        for (var i = 0; i < text4.length; i++) {
          parts.push(makeSymbol(text4[i], fontName, mode, options, classes.concat(fontClasses)));
        }
        return makeFragment(parts);
      }
    }
    if (type === "mathord") {
      return makeSymbol(text4, "Math-Italic", mode, options, classes.concat(["mathnormal"]));
    } else if (type === "textord") {
      var _font = symbols[mode][text4] && symbols[mode][text4].font;
      if (_font === "ams") {
        var _fontName = retrieveTextFontName("amsrm", fontWeight, fontShape);
        return makeSymbol(text4, _fontName, mode, options, classes.concat("amsrm", fontWeight, fontShape));
      } else if (_font === "main" || !_font) {
        var _fontName2 = retrieveTextFontName("textrm", fontWeight, fontShape);
        return makeSymbol(text4, _fontName2, mode, options, classes.concat(fontWeight, fontShape));
      } else {
        var _fontName3 = retrieveTextFontName(_font, fontWeight, fontShape);
        return makeSymbol(text4, _fontName3, mode, options, classes.concat(_fontName3, fontWeight, fontShape));
      }
    } else {
      throw new Error("unexpected type: " + type + " in makeOrd");
    }
  };
  var canCombine = (prev, next) => {
    if (createClass(prev.classes) !== createClass(next.classes) || prev.skew !== next.skew || prev.maxFontSize !== next.maxFontSize || prev.italic !== 0 && prev.hasClass("mathnormal")) {
      return false;
    }
    if (prev.classes.length === 1) {
      var cls = prev.classes[0];
      if (cls === "mbin" || cls === "mord") {
        return false;
      }
    }
    for (var key of Object.keys(prev.style)) {
      if (prev.style[key] !== next.style[key]) {
        return false;
      }
    }
    for (var _key of Object.keys(next.style)) {
      if (prev.style[_key] !== next.style[_key]) {
        return false;
      }
    }
    return true;
  };
  var tryCombineChars = (chars) => {
    for (var i = 0; i < chars.length - 1; i++) {
      var prev = chars[i];
      var next = chars[i + 1];
      if (prev instanceof SymbolNode && next instanceof SymbolNode && canCombine(prev, next)) {
        prev.text += next.text;
        prev.height = Math.max(prev.height, next.height);
        prev.depth = Math.max(prev.depth, next.depth);
        prev.italic = next.italic;
        chars.splice(i + 1, 1);
        i--;
      }
    }
    return chars;
  };
  var sizeElementFromChildren = function sizeElementFromChildren2(elem) {
    var height = 0;
    var depth = 0;
    var maxFontSize = 0;
    for (var i = 0; i < elem.children.length; i++) {
      var child = elem.children[i];
      if (child.height > height) {
        height = child.height;
      }
      if (child.depth > depth) {
        depth = child.depth;
      }
      if (child.maxFontSize > maxFontSize) {
        maxFontSize = child.maxFontSize;
      }
    }
    elem.height = height;
    elem.depth = depth;
    elem.maxFontSize = maxFontSize;
  };
  var makeSpan = function makeSpan2(classes, children, options, style) {
    var span = new Span(classes, children, options, style);
    sizeElementFromChildren(span);
    return span;
  };
  var makeSvgSpan = (classes, children, options, style) => new Span(classes, children, options, style);
  var makeLineSpan = function makeLineSpan2(className, options, thickness) {
    var line = makeSpan([className], [], options);
    line.height = Math.max(thickness || options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
    line.style.borderBottomWidth = makeEm(line.height);
    line.maxFontSize = 1;
    return line;
  };
  var makeAnchor = function makeAnchor2(href, classes, children, options) {
    var anchor = new Anchor(href, classes, children, options);
    sizeElementFromChildren(anchor);
    return anchor;
  };
  var makeFragment = function makeFragment2(children) {
    var fragment = new DocumentFragment(children);
    sizeElementFromChildren(fragment);
    return fragment;
  };
  var wrapFragment = function wrapFragment2(group, options) {
    if (group instanceof DocumentFragment) {
      return makeSpan([], [group], options);
    }
    return group;
  };
  var getVListChildrenAndDepth = function getVListChildrenAndDepth2(params) {
    if (params.positionType === "individualShift") {
      var oldChildren = params.children;
      var children = [oldChildren[0]];
      var _depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
      var currPos = _depth;
      for (var i = 1; i < oldChildren.length; i++) {
        var diff = -oldChildren[i].shift - currPos - oldChildren[i].elem.depth;
        var size = diff - (oldChildren[i - 1].elem.height + oldChildren[i - 1].elem.depth);
        currPos = currPos + diff;
        children.push({
          type: "kern",
          size
        });
        children.push(oldChildren[i]);
      }
      return {
        children,
        depth: _depth
      };
    }
    var depth;
    if (params.positionType === "top") {
      var bottom = params.positionData;
      for (var _i = 0; _i < params.children.length; _i++) {
        var child = params.children[_i];
        bottom -= child.type === "kern" ? child.size : child.elem.height + child.elem.depth;
      }
      depth = bottom;
    } else if (params.positionType === "bottom") {
      depth = -params.positionData;
    } else {
      var firstChild = params.children[0];
      if (firstChild.type !== "elem") {
        throw new Error('First child must have type "elem".');
      }
      if (params.positionType === "shift") {
        depth = -firstChild.elem.depth - params.positionData;
      } else if (params.positionType === "firstBaseline") {
        depth = -firstChild.elem.depth;
      } else {
        throw new Error("Invalid positionType " + params.positionType + ".");
      }
    }
    return {
      children: params.children,
      depth
    };
  };
  var makeVList = function makeVList2(params, options) {
    var {
      children,
      depth
    } = getVListChildrenAndDepth(params);
    var pstrutSize = 0;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.type === "elem") {
        var elem = child.elem;
        pstrutSize = Math.max(pstrutSize, elem.maxFontSize, elem.height);
      }
    }
    pstrutSize += 2;
    var pstrut = makeSpan(["pstrut"], []);
    pstrut.style.height = makeEm(pstrutSize);
    var realChildren = [];
    var minPos = depth;
    var maxPos = depth;
    var currPos = depth;
    for (var _i2 = 0; _i2 < children.length; _i2++) {
      var _child = children[_i2];
      if (_child.type === "kern") {
        currPos += _child.size;
      } else {
        var _elem = _child.elem;
        var classes = _child.wrapperClasses || [];
        var style = _child.wrapperStyle || {};
        var childWrap = makeSpan(classes, [pstrut, _elem], void 0, style);
        childWrap.style.top = makeEm(-pstrutSize - currPos - _elem.depth);
        if (_child.marginLeft) {
          childWrap.style.marginLeft = _child.marginLeft;
        }
        if (_child.marginRight) {
          childWrap.style.marginRight = _child.marginRight;
        }
        realChildren.push(childWrap);
        currPos += _elem.height + _elem.depth;
      }
      minPos = Math.min(minPos, currPos);
      maxPos = Math.max(maxPos, currPos);
    }
    var vlist = makeSpan(["vlist"], realChildren);
    vlist.style.height = makeEm(maxPos);
    var rows;
    if (minPos < 0) {
      var emptySpan = makeSpan([], []);
      var depthStrut = makeSpan(["vlist"], [emptySpan]);
      depthStrut.style.height = makeEm(-minPos);
      var topStrut = makeSpan(["vlist-s"], [new SymbolNode("\u200B")]);
      rows = [makeSpan(["vlist-r"], [vlist, topStrut]), makeSpan(["vlist-r"], [depthStrut])];
    } else {
      rows = [makeSpan(["vlist-r"], [vlist])];
    }
    var vtable = makeSpan(["vlist-t"], rows);
    if (rows.length === 2) {
      vtable.classes.push("vlist-t2");
    }
    vtable.height = maxPos;
    vtable.depth = -minPos;
    return vtable;
  };
  var makeGlue = (measurement, options) => {
    var rule = makeSpan(["mspace"], [], options);
    var size = calculateSize(measurement, options);
    rule.style.marginRight = makeEm(size);
    return rule;
  };
  var retrieveTextFontName = (fontFamily, fontWeight, fontShape) => {
    var baseFontName;
    var fontStylesName;
    switch (fontFamily) {
      case "amsrm":
        baseFontName = "AMS";
        break;
      case "textrm":
        baseFontName = "Main";
        break;
      case "textsf":
        baseFontName = "SansSerif";
        break;
      case "texttt":
        baseFontName = "Typewriter";
        break;
      default:
        baseFontName = fontFamily;
    }
    if (fontWeight === "textbf" && fontShape === "textit") {
      fontStylesName = "BoldItalic";
    } else if (fontWeight === "textbf") {
      fontStylesName = "Bold";
    } else if (fontShape === "textit") {
      fontStylesName = "Italic";
    } else {
      fontStylesName = "Regular";
    }
    return baseFontName + "-" + fontStylesName;
  };
  var fontMap = {
    // styles
    "mathbf": {
      variant: "bold",
      fontName: "Main-Bold"
    },
    "mathrm": {
      variant: "normal",
      fontName: "Main-Regular"
    },
    "textit": {
      variant: "italic",
      fontName: "Main-Italic"
    },
    "mathit": {
      variant: "italic",
      fontName: "Main-Italic"
    },
    "mathnormal": {
      variant: "italic",
      fontName: "Math-Italic"
    },
    "mathsfit": {
      variant: "sans-serif-italic",
      fontName: "SansSerif-Italic"
    },
    // "boldsymbol" is missing because they require the use of multiple fonts:
    // Math-BoldItalic and Main-Bold.  This is handled by a special case in
    // makeOrd which ends up calling boldsymbol.
    // families
    "mathbb": {
      variant: "double-struck",
      fontName: "AMS-Regular"
    },
    "mathcal": {
      variant: "script",
      fontName: "Caligraphic-Regular"
    },
    "mathfrak": {
      variant: "fraktur",
      fontName: "Fraktur-Regular"
    },
    "mathscr": {
      variant: "script",
      fontName: "Script-Regular"
    },
    "mathsf": {
      variant: "sans-serif",
      fontName: "SansSerif-Regular"
    },
    "mathtt": {
      variant: "monospace",
      fontName: "Typewriter-Regular"
    }
  };
  var svgData = {
    //   path, width, height
    vec: ["vec", 0.471, 0.714],
    // values from the font glyph
    oiintSize1: ["oiintSize1", 0.957, 0.499],
    // oval to overlay the integrand
    oiintSize2: ["oiintSize2", 1.472, 0.659],
    oiiintSize1: ["oiiintSize1", 1.304, 0.499],
    oiiintSize2: ["oiiintSize2", 1.98, 0.659]
  };
  var staticSvg = function staticSvg2(value, options) {
    var [pathName, width, height] = svgData[value];
    var path2 = new PathNode(pathName);
    var svgNode = new SvgNode([path2], {
      "width": makeEm(width),
      "height": makeEm(height),
      // Override CSS rule `.katex svg { width: 100% }`
      "style": "width:" + makeEm(width),
      "viewBox": "0 0 " + 1e3 * width + " " + 1e3 * height,
      "preserveAspectRatio": "xMinYMin"
    });
    var span = makeSvgSpan(["overlay"], [svgNode], options);
    span.height = height;
    span.style.height = makeEm(height);
    span.style.width = makeEm(width);
    return span;
  };
  var thinspace = {
    number: 3,
    unit: "mu"
  };
  var mediumspace = {
    number: 4,
    unit: "mu"
  };
  var thickspace = {
    number: 5,
    unit: "mu"
  };
  var spacings = {
    mord: {
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      minner: thinspace
    },
    mop: {
      mord: thinspace,
      mop: thinspace,
      mrel: thickspace,
      minner: thinspace
    },
    mbin: {
      mord: mediumspace,
      mop: mediumspace,
      mopen: mediumspace,
      minner: mediumspace
    },
    mrel: {
      mord: thickspace,
      mop: thickspace,
      mopen: thickspace,
      minner: thickspace
    },
    mopen: {},
    mclose: {
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      minner: thinspace
    },
    mpunct: {
      mord: thinspace,
      mop: thinspace,
      mrel: thickspace,
      mopen: thinspace,
      mclose: thinspace,
      mpunct: thinspace,
      minner: thinspace
    },
    minner: {
      mord: thinspace,
      mop: thinspace,
      mbin: mediumspace,
      mrel: thickspace,
      mopen: thinspace,
      mpunct: thinspace,
      minner: thinspace
    }
  };
  var tightSpacings = {
    mord: {
      mop: thinspace
    },
    mop: {
      mord: thinspace,
      mop: thinspace
    },
    mbin: {},
    mrel: {},
    mopen: {},
    mclose: {
      mop: thinspace
    },
    mpunct: {},
    minner: {
      mop: thinspace
    }
  };
  var _functions = {};
  var _htmlGroupBuilders = {};
  var _mathmlGroupBuilders = {};
  function defineFunction(_ref) {
    var {
      type,
      names,
      props,
      handler,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref;
    var data = {
      type,
      numArgs: props.numArgs,
      argTypes: props.argTypes,
      allowedInArgument: !!props.allowedInArgument,
      allowedInText: !!props.allowedInText,
      allowedInMath: props.allowedInMath === void 0 ? true : props.allowedInMath,
      numOptionalArgs: props.numOptionalArgs || 0,
      infix: !!props.infix,
      primitive: !!props.primitive,
      handler
    };
    for (var i = 0; i < names.length; ++i) {
      _functions[names[i]] = data;
    }
    if (type) {
      if (htmlBuilder3) {
        _htmlGroupBuilders[type] = htmlBuilder3;
      }
      if (mathmlBuilder3) {
        _mathmlGroupBuilders[type] = mathmlBuilder3;
      }
    }
  }
  function defineFunctionBuilders(_ref2) {
    var {
      type,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref2;
    defineFunction({
      type,
      names: [],
      props: {
        numArgs: 0
      },
      handler() {
        throw new Error("Should never be called.");
      },
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    });
  }
  var normalizeArgument = function normalizeArgument2(arg) {
    return arg.type === "ordgroup" && arg.body.length === 1 ? arg.body[0] : arg;
  };
  var ordargument = function ordargument2(arg) {
    return arg.type === "ordgroup" ? arg.body : [arg];
  };
  var binLeftCanceller = /* @__PURE__ */ new Set(["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"]);
  var binRightCanceller = /* @__PURE__ */ new Set(["rightmost", "mrel", "mclose", "mpunct"]);
  var styleMap$1 = {
    "display": Style$1.DISPLAY,
    "text": Style$1.TEXT,
    "script": Style$1.SCRIPT,
    "scriptscript": Style$1.SCRIPTSCRIPT
  };
  var DomEnum = {
    mord: "mord",
    mop: "mop",
    mbin: "mbin",
    mrel: "mrel",
    mopen: "mopen",
    mclose: "mclose",
    mpunct: "mpunct",
    minner: "minner"
  };
  var buildExpression$1 = function buildExpression(expression, options, isRealGroup, surrounding) {
    if (surrounding === void 0) {
      surrounding = [null, null];
    }
    var groups = [];
    for (var i = 0; i < expression.length; i++) {
      var output = buildGroup$1(expression[i], options);
      if (output instanceof DocumentFragment) {
        var children = output.children;
        groups.push(...children);
      } else {
        groups.push(output);
      }
    }
    tryCombineChars(groups);
    if (!isRealGroup) {
      return groups;
    }
    var glueOptions = options;
    if (expression.length === 1) {
      var node = expression[0];
      if (node.type === "sizing") {
        glueOptions = options.havingSize(node.size);
      } else if (node.type === "styling") {
        glueOptions = options.havingStyle(styleMap$1[node.style]);
      }
    }
    var dummyPrev = makeSpan([surrounding[0] || "leftmost"], [], options);
    var dummyNext = makeSpan([surrounding[1] || "rightmost"], [], options);
    var isRoot = isRealGroup === "root";
    _traverseNonSpaceNodes(groups, (node2, prev) => {
      var prevType = prev.classes[0];
      var type = node2.classes[0];
      if (prevType === "mbin" && binRightCanceller.has(type)) {
        prev.classes[0] = "mord";
      } else if (type === "mbin" && binLeftCanceller.has(prevType)) {
        node2.classes[0] = "mord";
      }
    }, {
      node: dummyPrev
    }, dummyNext, isRoot);
    _traverseNonSpaceNodes(groups, (node2, prev) => {
      var _tightSpacings$prevTy, _spacings$prevType;
      var prevType = getTypeOfDomTree(prev);
      var type = getTypeOfDomTree(node2);
      var space = prevType && type ? node2.hasClass("mtight") ? (_tightSpacings$prevTy = tightSpacings[prevType]) == null ? void 0 : _tightSpacings$prevTy[type] : (_spacings$prevType = spacings[prevType]) == null ? void 0 : _spacings$prevType[type] : null;
      if (space) {
        return makeGlue(space, glueOptions);
      }
    }, {
      node: dummyPrev
    }, dummyNext, isRoot);
    return groups;
  };
  var _traverseNonSpaceNodes = function traverseNonSpaceNodes(nodes, callback, prev, next, isRoot) {
    if (next) {
      nodes.push(next);
    }
    var i = 0;
    for (; i < nodes.length; i++) {
      var node = nodes[i];
      var partialGroup = checkPartialGroup(node);
      if (partialGroup) {
        _traverseNonSpaceNodes(partialGroup.children, callback, prev, null, isRoot);
        continue;
      }
      var nonspace = !node.hasClass("mspace");
      if (nonspace) {
        var result = callback(node, prev.node);
        if (result) {
          if (prev.insertAfter) {
            prev.insertAfter(result);
          } else {
            nodes.unshift(result);
            i++;
          }
        }
      }
      if (nonspace) {
        prev.node = node;
      } else if (isRoot && node.hasClass("newline")) {
        prev.node = makeSpan(["leftmost"]);
      }
      prev.insertAfter = /* @__PURE__ */ ((index) => (n) => {
        nodes.splice(index + 1, 0, n);
        i++;
      })(i);
    }
    if (next) {
      nodes.pop();
    }
  };
  var checkPartialGroup = function checkPartialGroup2(node) {
    if (node instanceof DocumentFragment || node instanceof Anchor || node instanceof Span && node.hasClass("enclosing")) {
      return node;
    }
    return null;
  };
  var _getOutermostNode = function getOutermostNode(node, side) {
    var partialGroup = checkPartialGroup(node);
    if (partialGroup) {
      var children = partialGroup.children;
      if (children.length) {
        if (side === "right") {
          return _getOutermostNode(children[children.length - 1], "right");
        } else if (side === "left") {
          return _getOutermostNode(children[0], "left");
        }
      }
    }
    return node;
  };
  var getTypeOfDomTree = function getTypeOfDomTree2(node, side) {
    if (!node) {
      return null;
    }
    if (side) {
      node = _getOutermostNode(node, side);
    }
    var className = node.classes[0];
    return DomEnum[className] || null;
  };
  var makeNullDelimiter = function makeNullDelimiter2(options, classes) {
    var moreClasses = ["nulldelimiter"].concat(options.baseSizingClasses());
    return makeSpan(classes.concat(moreClasses));
  };
  var buildGroup$1 = function buildGroup(group, options, baseOptions) {
    if (!group) {
      return makeSpan();
    }
    if (_htmlGroupBuilders[group.type]) {
      var groupNode = _htmlGroupBuilders[group.type](group, options);
      if (baseOptions && options.size !== baseOptions.size) {
        groupNode = makeSpan(options.sizingClasses(baseOptions), [groupNode], options);
        var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
        groupNode.height *= multiplier;
        groupNode.depth *= multiplier;
      }
      return groupNode;
    } else {
      throw new ParseError("Got group of unknown type: '" + group.type + "'");
    }
  };
  function buildHTMLUnbreakable(children, options) {
    var body = makeSpan(["base"], children, options);
    var strut = makeSpan(["strut"]);
    strut.style.height = makeEm(body.height + body.depth);
    if (body.depth) {
      strut.style.verticalAlign = makeEm(-body.depth);
    }
    body.children.unshift(strut);
    return body;
  }
  function buildHTML(tree, options) {
    var tag = null;
    if (tree.length === 1 && tree[0].type === "tag") {
      tag = tree[0].tag;
      tree = tree[0].body;
    }
    var expression = buildExpression$1(tree, options, "root");
    var eqnNum;
    if (expression.length === 2 && expression[1].hasClass("tag")) {
      eqnNum = expression.pop();
    }
    var children = [];
    var parts = [];
    for (var i = 0; i < expression.length; i++) {
      parts.push(expression[i]);
      if (expression[i].hasClass("mbin") || expression[i].hasClass("mrel") || expression[i].hasClass("allowbreak")) {
        var nobreak = false;
        while (i < expression.length - 1 && expression[i + 1].hasClass("mspace") && !expression[i + 1].hasClass("newline")) {
          i++;
          parts.push(expression[i]);
          if (expression[i].hasClass("nobreak")) {
            nobreak = true;
          }
        }
        if (!nobreak) {
          children.push(buildHTMLUnbreakable(parts, options));
          parts = [];
        }
      } else if (expression[i].hasClass("newline")) {
        parts.pop();
        if (parts.length > 0) {
          children.push(buildHTMLUnbreakable(parts, options));
          parts = [];
        }
        children.push(expression[i]);
      }
    }
    if (parts.length > 0) {
      children.push(buildHTMLUnbreakable(parts, options));
    }
    var tagChild;
    if (tag) {
      tagChild = buildHTMLUnbreakable(buildExpression$1(tag, options, true), options);
      tagChild.classes = ["tag"];
      children.push(tagChild);
    } else if (eqnNum) {
      children.push(eqnNum);
    }
    var htmlNode = makeSpan(["katex-html"], children);
    htmlNode.setAttribute("aria-hidden", "true");
    if (tagChild) {
      var strut = tagChild.children[0];
      strut.style.height = makeEm(htmlNode.height + htmlNode.depth);
      if (htmlNode.depth) {
        strut.style.verticalAlign = makeEm(-htmlNode.depth);
      }
    }
    return htmlNode;
  }
  function newDocumentFragment(children) {
    return new DocumentFragment(children);
  }
  var MathNode = class {
    constructor(type, children, classes) {
      this.type = void 0;
      this.attributes = void 0;
      this.children = void 0;
      this.classes = void 0;
      this.type = type;
      this.attributes = {};
      this.children = children || [];
      this.classes = classes || [];
    }
    /**
     * Sets an attribute on a MathML node. MathML depends on attributes to convey a
     * semantic content, so this is used heavily.
     */
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
    /**
     * Gets an attribute on a MathML node.
     */
    getAttribute(name) {
      return this.attributes[name];
    }
    /**
     * Converts the math node into a MathML-namespaced DOM element.
     */
    toNode() {
      var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          node.setAttribute(attr, this.attributes[attr]);
        }
      }
      if (this.classes.length > 0) {
        node.className = createClass(this.classes);
      }
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i] instanceof TextNode && this.children[i + 1] instanceof TextNode) {
          var text4 = this.children[i].toText() + this.children[++i].toText();
          while (this.children[i + 1] instanceof TextNode) {
            text4 += this.children[++i].toText();
          }
          node.appendChild(new TextNode(text4).toNode());
        } else {
          node.appendChild(this.children[i].toNode());
        }
      }
      return node;
    }
    /**
     * Converts the math node into an HTML markup string.
     */
    toMarkup() {
      var markup = "<" + this.type;
      for (var attr in this.attributes) {
        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
          markup += " " + attr + '="';
          markup += escape(this.attributes[attr]);
          markup += '"';
        }
      }
      if (this.classes.length > 0) {
        markup += ' class ="' + escape(createClass(this.classes)) + '"';
      }
      markup += ">";
      for (var i = 0; i < this.children.length; i++) {
        markup += this.children[i].toMarkup();
      }
      markup += "</" + this.type + ">";
      return markup;
    }
    /**
     * Converts the math node into a string, similar to innerText, but escaped.
     */
    toText() {
      return this.children.map((child) => child.toText()).join("");
    }
  };
  var TextNode = class {
    constructor(text4) {
      this.text = void 0;
      this.text = text4;
    }
    /**
     * Converts the text node into a DOM text node.
     */
    toNode() {
      return document.createTextNode(this.text);
    }
    /**
     * Converts the text node into escaped HTML markup
     * (representing the text itself).
     */
    toMarkup() {
      return escape(this.toText());
    }
    /**
     * Converts the text node into a string
     * (representing the text itself).
     */
    toText() {
      return this.text;
    }
  };
  var SpaceNode = class {
    /**
     * Create a Space node with width given in CSS ems.
     */
    constructor(width) {
      this.width = void 0;
      this.character = void 0;
      this.width = width;
      if (width >= 0.05555 && width <= 0.05556) {
        this.character = "\u200A";
      } else if (width >= 0.1666 && width <= 0.1667) {
        this.character = "\u2009";
      } else if (width >= 0.2222 && width <= 0.2223) {
        this.character = "\u2005";
      } else if (width >= 0.2777 && width <= 0.2778) {
        this.character = "\u2005\u200A";
      } else if (width >= -0.05556 && width <= -0.05555) {
        this.character = "\u200A\u2063";
      } else if (width >= -0.1667 && width <= -0.1666) {
        this.character = "\u2009\u2063";
      } else if (width >= -0.2223 && width <= -0.2222) {
        this.character = "\u205F\u2063";
      } else if (width >= -0.2778 && width <= -0.2777) {
        this.character = "\u2005\u2063";
      } else {
        this.character = null;
      }
    }
    /**
     * Converts the math node into a MathML-namespaced DOM element.
     */
    toNode() {
      if (this.character) {
        return document.createTextNode(this.character);
      } else {
        var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
        node.setAttribute("width", makeEm(this.width));
        return node;
      }
    }
    /**
     * Converts the math node into an HTML markup string.
     */
    toMarkup() {
      if (this.character) {
        return "<mtext>" + this.character + "</mtext>";
      } else {
        return '<mspace width="' + makeEm(this.width) + '"/>';
      }
    }
    /**
     * Converts the math node into a string, similar to innerText.
     */
    toText() {
      if (this.character) {
        return this.character;
      } else {
        return " ";
      }
    }
  };
  var noVariantSymbols = /* @__PURE__ */ new Set(["\\imath", "\\jmath"]);
  var rowLikeTypes = /* @__PURE__ */ new Set(["mrow", "mtable"]);
  var makeText = function makeText2(text4, mode, options) {
    if (symbols[mode][text4] && symbols[mode][text4].replace && text4.charCodeAt(0) !== 55349 && !(ligatures.hasOwnProperty(text4) && options && (options.fontFamily && options.fontFamily.slice(4, 6) === "tt" || options.font && options.font.slice(4, 6) === "tt"))) {
      text4 = symbols[mode][text4].replace;
    }
    return new TextNode(text4);
  };
  var makeRow = function makeRow2(body) {
    if (body.length === 1) {
      return body[0];
    } else {
      return new MathNode("mrow", body);
    }
  };
  var mathFontVariants = {
    mathit: "italic",
    boldsymbol: (group) => group.type === "textord" ? "bold" : "bold-italic",
    mathbf: "bold",
    mathbb: "double-struck",
    mathsfit: "sans-serif-italic",
    mathfrak: "fraktur",
    mathscr: "script",
    mathcal: "script",
    mathsf: "sans-serif",
    mathtt: "monospace"
  };
  var getVariant = (group, options) => {
    if (group.mode === "text") {
      if (options.fontFamily === "texttt") {
        return "monospace";
      } else if (options.fontFamily === "textsf") {
        if (options.fontShape === "textit" && options.fontWeight === "textbf") {
          return "sans-serif-bold-italic";
        } else if (options.fontShape === "textit") {
          return "sans-serif-italic";
        } else if (options.fontWeight === "textbf") {
          return "bold-sans-serif";
        } else {
          return "sans-serif";
        }
      } else if (options.fontShape === "textit" && options.fontWeight === "textbf") {
        return "bold-italic";
      } else if (options.fontShape === "textit") {
        return "italic";
      } else if (options.fontWeight === "textbf") {
        return "bold";
      }
    }
    var font = options.font;
    if (!font || font === "mathnormal") {
      return null;
    }
    var mode = group.mode;
    var mathVariant = mathFontVariants[font];
    if (mathVariant) {
      return typeof mathVariant === "function" ? mathVariant(group) : mathVariant;
    }
    var text4 = group.text;
    if (noVariantSymbols.has(text4)) {
      return null;
    }
    if (symbols[mode][text4]) {
      var replacement = symbols[mode][text4].replace;
      if (replacement) {
        text4 = replacement;
      }
    }
    var fontName = fontMap[font].fontName;
    if (getCharacterMetrics(text4, fontName, mode)) {
      return fontMap[font].variant;
    }
    return null;
  };
  function isNumberPunctuation(group) {
    if (!group) {
      return false;
    }
    if (group.type === "mi" && group.children.length === 1) {
      var child = group.children[0];
      return child instanceof TextNode && child.text === ".";
    } else if (group.type === "mo" && group.children.length === 1 && group.getAttribute("separator") === "true" && group.getAttribute("lspace") === "0em" && group.getAttribute("rspace") === "0em") {
      var _child = group.children[0];
      return _child instanceof TextNode && _child.text === ",";
    } else {
      return false;
    }
  }
  var buildExpression2 = function buildExpression3(expression, options, isOrdgroup) {
    if (expression.length === 1) {
      var group = buildGroup2(expression[0], options);
      if (isOrdgroup && group instanceof MathNode && group.type === "mo") {
        group.setAttribute("lspace", "0em");
        group.setAttribute("rspace", "0em");
      }
      return [group];
    }
    var groups = [];
    var lastGroup;
    for (var i = 0; i < expression.length; i++) {
      var _group = buildGroup2(expression[i], options);
      if (_group instanceof MathNode && lastGroup instanceof MathNode) {
        if (_group.type === "mtext" && lastGroup.type === "mtext" && _group.getAttribute("mathvariant") === lastGroup.getAttribute("mathvariant")) {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (_group.type === "mn" && lastGroup.type === "mn") {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (isNumberPunctuation(_group) && lastGroup.type === "mn") {
          lastGroup.children.push(..._group.children);
          continue;
        } else if (_group.type === "mn" && isNumberPunctuation(lastGroup)) {
          _group.children = [...lastGroup.children, ..._group.children];
          groups.pop();
        } else if ((_group.type === "msup" || _group.type === "msub") && _group.children.length >= 1 && (lastGroup.type === "mn" || isNumberPunctuation(lastGroup))) {
          var base = _group.children[0];
          if (base instanceof MathNode && base.type === "mn") {
            base.children = [...lastGroup.children, ...base.children];
            groups.pop();
          }
        } else if (lastGroup.type === "mi" && lastGroup.children.length === 1) {
          var lastChild = lastGroup.children[0];
          if (lastChild instanceof TextNode && lastChild.text === "\u0338" && (_group.type === "mo" || _group.type === "mi" || _group.type === "mn")) {
            var child = _group.children[0];
            if (child instanceof TextNode && child.text.length > 0) {
              child.text = child.text.slice(0, 1) + "\u0338" + child.text.slice(1);
              groups.pop();
            }
          }
        }
      }
      groups.push(_group);
      lastGroup = _group;
    }
    return groups;
  };
  var buildExpressionRow = function buildExpressionRow2(expression, options, isOrdgroup) {
    return makeRow(buildExpression2(expression, options, isOrdgroup));
  };
  var buildGroup2 = function buildGroup3(group, options) {
    if (!group) {
      return new MathNode("mrow");
    }
    if (_mathmlGroupBuilders[group.type]) {
      return _mathmlGroupBuilders[group.type](group, options);
    } else {
      throw new ParseError("Got group of unknown type: '" + group.type + "'");
    }
  };
  function buildMathML(tree, texExpression, options, isDisplayMode, forMathmlOnly) {
    var expression = buildExpression2(tree, options);
    var wrapper;
    if (expression.length === 1 && expression[0] instanceof MathNode && rowLikeTypes.has(expression[0].type)) {
      wrapper = expression[0];
    } else {
      wrapper = new MathNode("mrow", expression);
    }
    var annotation = new MathNode("annotation", [new TextNode(texExpression)]);
    annotation.setAttribute("encoding", "application/x-tex");
    var semantics = new MathNode("semantics", [wrapper, annotation]);
    var math3 = new MathNode("math", [semantics]);
    math3.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
    if (isDisplayMode) {
      math3.setAttribute("display", "block");
    }
    var wrapperClass = forMathmlOnly ? "katex" : "katex-mathml";
    return makeSpan([wrapperClass], [math3]);
  }
  var sizeStyleMap = [
    // Each element contains [textsize, scriptsize, scriptscriptsize].
    // The size mappings are taken from TeX with \normalsize=10pt.
    [1, 1, 1],
    // size1: [5, 5, 5]              \tiny
    [2, 1, 1],
    // size2: [6, 5, 5]
    [3, 1, 1],
    // size3: [7, 5, 5]              \scriptsize
    [4, 2, 1],
    // size4: [8, 6, 5]              \footnotesize
    [5, 2, 1],
    // size5: [9, 6, 5]              \small
    [6, 3, 1],
    // size6: [10, 7, 5]             \normalsize
    [7, 4, 2],
    // size7: [12, 8, 6]             \large
    [8, 6, 3],
    // size8: [14.4, 10, 7]          \Large
    [9, 7, 6],
    // size9: [17.28, 12, 10]        \LARGE
    [10, 8, 7],
    // size10: [20.74, 14.4, 12]     \huge
    [11, 10, 9]
    // size11: [24.88, 20.74, 17.28] \HUGE
  ];
  var sizeMultipliers = [
    // fontMetrics.js:getGlobalMetrics also uses size indexes, so if
    // you change size indexes, change that function.
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
    1,
    1.2,
    1.44,
    1.728,
    2.074,
    2.488
  ];
  var sizeAtStyle = function sizeAtStyle2(size, style) {
    return style.size < 2 ? size : sizeStyleMap[size - 1][style.size - 1];
  };
  var Options = class _Options {
    constructor(data) {
      this.style = void 0;
      this.color = void 0;
      this.size = void 0;
      this.textSize = void 0;
      this.phantom = void 0;
      this.font = void 0;
      this.fontFamily = void 0;
      this.fontWeight = void 0;
      this.fontShape = void 0;
      this.sizeMultiplier = void 0;
      this.maxSize = void 0;
      this.minRuleThickness = void 0;
      this._fontMetrics = void 0;
      this.style = data.style;
      this.color = data.color;
      this.size = data.size || _Options.BASESIZE;
      this.textSize = data.textSize || this.size;
      this.phantom = !!data.phantom;
      this.font = data.font || "";
      this.fontFamily = data.fontFamily || "";
      this.fontWeight = data.fontWeight || "";
      this.fontShape = data.fontShape || "";
      this.sizeMultiplier = sizeMultipliers[this.size - 1];
      this.maxSize = data.maxSize;
      this.minRuleThickness = data.minRuleThickness;
      this._fontMetrics = void 0;
    }
    /**
     * Returns a new options object with the same properties as "this".  Properties
     * from "extension" will be copied to the new options object.
     */
    extend(extension) {
      var data = {
        style: this.style,
        size: this.size,
        textSize: this.textSize,
        color: this.color,
        phantom: this.phantom,
        font: this.font,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        fontShape: this.fontShape,
        maxSize: this.maxSize,
        minRuleThickness: this.minRuleThickness
      };
      Object.assign(data, extension);
      return new _Options(data);
    }
    /**
     * Return an options object with the given style. If `this.style === style`,
     * returns `this`.
     */
    havingStyle(style) {
      if (this.style === style) {
        return this;
      } else {
        return this.extend({
          style,
          size: sizeAtStyle(this.textSize, style)
        });
      }
    }
    /**
     * Return an options object with a cramped version of the current style. If
     * the current style is cramped, returns `this`.
     */
    havingCrampedStyle() {
      return this.havingStyle(this.style.cramp());
    }
    /**
     * Return an options object with the given size and in at least `\textstyle`.
     * Returns `this` if appropriate.
     */
    havingSize(size) {
      if (this.size === size && this.textSize === size) {
        return this;
      } else {
        return this.extend({
          style: this.style.text(),
          size,
          textSize: size,
          sizeMultiplier: sizeMultipliers[size - 1]
        });
      }
    }
    /**
     * Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
     * changes to at least `\textstyle`.
     */
    havingBaseStyle(style) {
      style = style || this.style.text();
      var wantSize = sizeAtStyle(_Options.BASESIZE, style);
      if (this.size === wantSize && this.textSize === _Options.BASESIZE && this.style === style) {
        return this;
      } else {
        return this.extend({
          style,
          size: wantSize
        });
      }
    }
    /**
     * Remove the effect of sizing changes such as \Huge.
     * Keep the effect of the current style, such as \scriptstyle.
     */
    havingBaseSizing() {
      var size;
      switch (this.style.id) {
        case 4:
        case 5:
          size = 3;
          break;
        case 6:
        case 7:
          size = 1;
          break;
        default:
          size = 6;
      }
      return this.extend({
        style: this.style.text(),
        size
      });
    }
    /**
     * Create a new options object with the given color.
     */
    withColor(color) {
      return this.extend({
        color
      });
    }
    /**
     * Create a new options object with "phantom" set to true.
     */
    withPhantom() {
      return this.extend({
        phantom: true
      });
    }
    /**
     * Creates a new options object with the given math font or old text font.
     * @type {[type]}
     */
    withFont(font) {
      return this.extend({
        font
      });
    }
    /**
     * Create a new options objects with the given fontFamily.
     */
    withTextFontFamily(fontFamily) {
      return this.extend({
        fontFamily,
        font: ""
      });
    }
    /**
     * Creates a new options object with the given font weight
     */
    withTextFontWeight(fontWeight) {
      return this.extend({
        fontWeight,
        font: ""
      });
    }
    /**
     * Creates a new options object with the given font weight
     */
    withTextFontShape(fontShape) {
      return this.extend({
        fontShape,
        font: ""
      });
    }
    /**
     * Return the CSS sizing classes required to switch from enclosing options
     * `oldOptions` to `this`. Returns an array of classes.
     */
    sizingClasses(oldOptions) {
      if (oldOptions.size !== this.size) {
        return ["sizing", "reset-size" + oldOptions.size, "size" + this.size];
      } else {
        return [];
      }
    }
    /**
     * Return the CSS sizing classes required to switch to the base size. Like
     * `this.havingSize(BASESIZE).sizingClasses(this)`.
     */
    baseSizingClasses() {
      if (this.size !== _Options.BASESIZE) {
        return ["sizing", "reset-size" + this.size, "size" + _Options.BASESIZE];
      } else {
        return [];
      }
    }
    /**
     * Return the font metrics for this size.
     */
    fontMetrics() {
      if (!this._fontMetrics) {
        this._fontMetrics = getGlobalMetrics(this.size);
      }
      return this._fontMetrics;
    }
    /**
     * Gets the CSS color of the current options object
     */
    getColor() {
      if (this.phantom) {
        return "transparent";
      } else {
        return this.color;
      }
    }
  };
  Options.BASESIZE = 6;
  var optionsFromSettings = function optionsFromSettings2(settings) {
    return new Options({
      style: settings.displayMode ? Style$1.DISPLAY : Style$1.TEXT,
      maxSize: settings.maxSize,
      minRuleThickness: settings.minRuleThickness
    });
  };
  var displayWrap = function displayWrap2(node, settings) {
    if (settings.displayMode) {
      var classes = ["katex-display"];
      if (settings.leqno) {
        classes.push("leqno");
      }
      if (settings.fleqn) {
        classes.push("fleqn");
      }
      node = makeSpan(classes, [node]);
    }
    return node;
  };
  var buildTree = function buildTree2(tree, expression, settings) {
    var options = optionsFromSettings(settings);
    var katexNode;
    if (settings.output === "mathml") {
      return buildMathML(tree, expression, options, settings.displayMode, true);
    } else if (settings.output === "html") {
      var htmlNode = buildHTML(tree, options);
      katexNode = makeSpan(["katex"], [htmlNode]);
    } else {
      var mathMLNode = buildMathML(tree, expression, options, settings.displayMode, false);
      var _htmlNode = buildHTML(tree, options);
      katexNode = makeSpan(["katex"], [mathMLNode, _htmlNode]);
    }
    return displayWrap(katexNode, settings);
  };
  var buildHTMLTree = function buildHTMLTree2(tree, expression, settings) {
    var options = optionsFromSettings(settings);
    var htmlNode = buildHTML(tree, options);
    var katexNode = makeSpan(["katex"], [htmlNode]);
    return displayWrap(katexNode, settings);
  };
  var stretchyCodePoint = {
    widehat: "^",
    widecheck: "\u02C7",
    widetilde: "~",
    utilde: "~",
    overleftarrow: "\u2190",
    underleftarrow: "\u2190",
    xleftarrow: "\u2190",
    overrightarrow: "\u2192",
    underrightarrow: "\u2192",
    xrightarrow: "\u2192",
    underbrace: "\u23DF",
    overbrace: "\u23DE",
    underbracket: "\u23B5",
    overbracket: "\u23B4",
    overgroup: "\u23E0",
    undergroup: "\u23E1",
    overleftrightarrow: "\u2194",
    underleftrightarrow: "\u2194",
    xleftrightarrow: "\u2194",
    Overrightarrow: "\u21D2",
    xRightarrow: "\u21D2",
    overleftharpoon: "\u21BC",
    xleftharpoonup: "\u21BC",
    overrightharpoon: "\u21C0",
    xrightharpoonup: "\u21C0",
    xLeftarrow: "\u21D0",
    xLeftrightarrow: "\u21D4",
    xhookleftarrow: "\u21A9",
    xhookrightarrow: "\u21AA",
    xmapsto: "\u21A6",
    xrightharpoondown: "\u21C1",
    xleftharpoondown: "\u21BD",
    xrightleftharpoons: "\u21CC",
    xleftrightharpoons: "\u21CB",
    xtwoheadleftarrow: "\u219E",
    xtwoheadrightarrow: "\u21A0",
    xlongequal: "=",
    xtofrom: "\u21C4",
    xrightleftarrows: "\u21C4",
    xrightequilibrium: "\u21CC",
    // Not a perfect match.
    xleftequilibrium: "\u21CB",
    // None better available.
    "\\cdrightarrow": "\u2192",
    "\\cdleftarrow": "\u2190",
    "\\cdlongequal": "="
  };
  var stretchyMathML = function stretchyMathML2(label) {
    var node = new MathNode("mo", [new TextNode(stretchyCodePoint[label.replace(/^\\/, "")])]);
    node.setAttribute("stretchy", "true");
    return node;
  };
  var katexImagesData = {
    //   path(s), minWidth, height, align
    overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
    underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
    xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
    "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
    // CD minwwidth2.5pc
    xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
    "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
    Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
    xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
    xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
    overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
    xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
    overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
    xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
    xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
    "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
    xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
    xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
    overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
    underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
    underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
    xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
    xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
    xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
    xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
    xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
    xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
    overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
    overbracket: [["leftbracketover", "rightbracketover"], 1.6, 440],
    underbracket: [["leftbracketunder", "rightbracketunder"], 1.6, 410],
    overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
    undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
    xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
    xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
    // The next three arrows are from the mhchem package.
    // In mhchem.sty, min-length is 2.0em. But these arrows might appear in the
    // document as \xrightarrow or \xrightleftharpoons. Those have
    // min-length = 1.75em, so we set min-length on these next three to match.
    xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
    xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
    xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
  };
  var wideAccentLabels = /* @__PURE__ */ new Set(["widehat", "widecheck", "widetilde", "utilde"]);
  var stretchySvg = function stretchySvg2(group, options) {
    function buildSvgSpan_() {
      var viewBoxWidth = 4e5;
      var label = group.label.slice(1);
      if (wideAccentLabels.has(label) && "base" in group) {
        var numChars = group.base.type === "ordgroup" ? group.base.body.length : 1;
        var viewBoxHeight;
        var pathName;
        var _height;
        if (numChars > 5) {
          if (label === "widehat" || label === "widecheck") {
            viewBoxHeight = 420;
            viewBoxWidth = 2364;
            _height = 0.42;
            pathName = label + "4";
          } else {
            viewBoxHeight = 312;
            viewBoxWidth = 2340;
            _height = 0.34;
            pathName = "tilde4";
          }
        } else {
          var imgIndex = [1, 1, 2, 2, 3, 3][numChars];
          if (label === "widehat" || label === "widecheck") {
            viewBoxWidth = [0, 1062, 2364, 2364, 2364][imgIndex];
            viewBoxHeight = [0, 239, 300, 360, 420][imgIndex];
            _height = [0, 0.24, 0.3, 0.3, 0.36, 0.42][imgIndex];
            pathName = label + imgIndex;
          } else {
            viewBoxWidth = [0, 600, 1033, 2339, 2340][imgIndex];
            viewBoxHeight = [0, 260, 286, 306, 312][imgIndex];
            _height = [0, 0.26, 0.286, 0.3, 0.306, 0.34][imgIndex];
            pathName = "tilde" + imgIndex;
          }
        }
        var path2 = new PathNode(pathName);
        var svgNode = new SvgNode([path2], {
          "width": "100%",
          "height": makeEm(_height),
          "viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight,
          "preserveAspectRatio": "none"
        });
        return {
          span: makeSvgSpan([], [svgNode], options),
          minWidth: 0,
          height: _height
        };
      } else {
        var spans = [];
        var data = katexImagesData[label];
        if (!data) {
          throw new Error('No SVG data for "' + label + '".');
        }
        var [paths, _minWidth, _viewBoxHeight] = data;
        var _height2 = _viewBoxHeight / 1e3;
        var numSvgChildren = paths.length;
        var widthClasses;
        var aligns;
        if (numSvgChildren === 1) {
          if (data.length !== 4) {
            throw new Error('Expected 4-tuple for single-path SVG data "' + label + '".');
          }
          widthClasses = ["hide-tail"];
          aligns = [data[3]];
        } else if (numSvgChildren === 2) {
          widthClasses = ["halfarrow-left", "halfarrow-right"];
          aligns = ["xMinYMin", "xMaxYMin"];
        } else if (numSvgChildren === 3) {
          widthClasses = ["brace-left", "brace-center", "brace-right"];
          aligns = ["xMinYMin", "xMidYMin", "xMaxYMin"];
        } else {
          throw new Error("Correct katexImagesData or update code here to support\n                    " + numSvgChildren + " children.");
        }
        for (var i = 0; i < numSvgChildren; i++) {
          var _path = new PathNode(paths[i]);
          var _svgNode = new SvgNode([_path], {
            "width": "400em",
            "height": makeEm(_height2),
            "viewBox": "0 0 " + viewBoxWidth + " " + _viewBoxHeight,
            "preserveAspectRatio": aligns[i] + " slice"
          });
          var _span = makeSvgSpan([widthClasses[i]], [_svgNode], options);
          if (numSvgChildren === 1) {
            return {
              span: _span,
              minWidth: _minWidth,
              height: _height2
            };
          } else {
            _span.style.height = makeEm(_height2);
            spans.push(_span);
          }
        }
        return {
          span: makeSpan(["stretchy"], spans, options),
          minWidth: _minWidth,
          height: _height2
        };
      }
    }
    var {
      span,
      minWidth,
      height
    } = buildSvgSpan_();
    span.height = height;
    span.style.height = makeEm(height);
    if (minWidth > 0) {
      span.style.minWidth = makeEm(minWidth);
    }
    return span;
  };
  var stretchyEnclose = function stretchyEnclose2(inner2, label, topPad, bottomPad, options) {
    var img;
    var totalHeight = inner2.height + inner2.depth + topPad + bottomPad;
    if (/fbox|color|angl/.test(label)) {
      img = makeSpan(["stretchy", label], [], options);
      if (label === "fbox") {
        var color = options.color && options.getColor();
        if (color) {
          img.style.borderColor = color;
        }
      }
    } else {
      var lines = [];
      if (/^[bx]cancel$/.test(label)) {
        lines.push(new LineNode({
          "x1": "0",
          "y1": "0",
          "x2": "100%",
          "y2": "100%",
          "stroke-width": "0.046em"
        }));
      }
      if (/^x?cancel$/.test(label)) {
        lines.push(new LineNode({
          "x1": "0",
          "y1": "100%",
          "x2": "100%",
          "y2": "0",
          "stroke-width": "0.046em"
        }));
      }
      var svgNode = new SvgNode(lines, {
        "width": "100%",
        "height": makeEm(totalHeight)
      });
      img = makeSvgSpan([], [svgNode], options);
    }
    img.height = totalHeight;
    img.style.height = makeEm(totalHeight);
    return img;
  };
  var ATOMS = {
    "bin": 1,
    "close": 1,
    "inner": 1,
    "open": 1,
    "punct": 1,
    "rel": 1
  };
  var NON_ATOMS = {
    "accent-token": 1,
    "mathord": 1,
    "op-token": 1,
    "spacing": 1,
    "textord": 1
  };
  function isAtom(value) {
    return value in ATOMS;
  }
  function assertNodeType(node, type) {
    if (!node || node.type !== type) {
      throw new Error("Expected node of type " + type + ", but got " + (node ? "node of type " + node.type : String(node)));
    }
    return node;
  }
  function assertSymbolNodeType(node) {
    var typedNode = checkSymbolNodeType(node);
    if (!typedNode) {
      throw new Error("Expected node of symbol group type, but got " + (node ? "node of type " + node.type : String(node)));
    }
    return typedNode;
  }
  function checkSymbolNodeType(node) {
    if (node && (node.type === "atom" || NON_ATOMS.hasOwnProperty(node.type))) {
      return node;
    }
    return null;
  }
  var getBaseSymbol = (group) => {
    if (group instanceof SymbolNode) {
      return group;
    }
    if (hasHtmlDomChildren(group) && group.children.length === 1) {
      return getBaseSymbol(group.children[0]);
    }
  };
  var htmlBuilder$a = (grp, options) => {
    var base;
    var group;
    var supSubGroup;
    if (grp && grp.type === "supsub") {
      group = assertNodeType(grp.base, "accent");
      base = group.base;
      grp.base = base;
      supSubGroup = assertSpan(buildGroup$1(grp, options));
      grp.base = group;
    } else {
      group = assertNodeType(grp, "accent");
      base = group.base;
    }
    var body = buildGroup$1(base, options.havingCrampedStyle());
    var mustShift = group.isShifty && isCharacterBox(base);
    var skew = 0;
    if (mustShift) {
      var _getBaseSymbol$skew, _getBaseSymbol;
      skew = (_getBaseSymbol$skew = (_getBaseSymbol = getBaseSymbol(body)) == null ? void 0 : _getBaseSymbol.skew) != null ? _getBaseSymbol$skew : 0;
    }
    var accentBelow = group.label === "\\c";
    var clearance = accentBelow ? body.height + body.depth : Math.min(body.height, options.fontMetrics().xHeight);
    var accentBody;
    if (!group.isStretchy) {
      var accent2;
      var width;
      if (group.label === "\\vec") {
        accent2 = staticSvg("vec", options);
        width = svgData.vec[1];
      } else {
        accent2 = makeOrd({
          type: "textord",
          mode: group.mode,
          text: group.label
        }, options, "textord");
        accent2 = assertSymbolDomNode(accent2);
        accent2.italic = 0;
        width = accent2.width;
        if (accentBelow) {
          clearance += accent2.depth;
        }
      }
      accentBody = makeSpan(["accent-body"], [accent2]);
      var accentFull = group.label === "\\textcircled";
      if (accentFull) {
        accentBody.classes.push("accent-full");
        clearance = body.height;
      }
      var left = skew;
      if (!accentFull) {
        left -= width / 2;
      }
      accentBody.style.left = makeEm(left);
      if (group.label === "\\textcircled") {
        accentBody.style.top = ".2em";
      }
      accentBody = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body
        }, {
          type: "kern",
          size: -clearance
        }, {
          type: "elem",
          elem: accentBody
        }]
      });
    } else {
      accentBody = stretchySvg(group, options);
      accentBody = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body
        }, {
          type: "elem",
          elem: accentBody,
          wrapperClasses: ["svg-align"],
          wrapperStyle: skew > 0 ? {
            width: "calc(100% - " + makeEm(2 * skew) + ")",
            marginLeft: makeEm(2 * skew)
          } : void 0
        }]
      });
    }
    var accentWrap = makeSpan(["mord", "accent"], [accentBody], options);
    if (supSubGroup) {
      supSubGroup.children[0] = accentWrap;
      supSubGroup.height = Math.max(accentWrap.height, supSubGroup.height);
      supSubGroup.classes[0] = "mord";
      return supSubGroup;
    } else {
      return accentWrap;
    }
  };
  var mathmlBuilder$9 = (group, options) => {
    var accentNode = group.isStretchy ? stretchyMathML(group.label) : new MathNode("mo", [makeText(group.label, group.mode)]);
    var node = new MathNode("mover", [buildGroup2(group.base, options), accentNode]);
    node.setAttribute("accent", "true");
    return node;
  };
  var NON_STRETCHY_ACCENT_REGEX = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map((accent2) => "\\" + accent2).join("|"));
  defineFunction({
    type: "accent",
    names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
    props: {
      numArgs: 1
    },
    handler: (context, args) => {
      var base = normalizeArgument(args[0]);
      var isStretchy = !NON_STRETCHY_ACCENT_REGEX.test(context.funcName);
      var isShifty = !isStretchy || context.funcName === "\\widehat" || context.funcName === "\\widetilde" || context.funcName === "\\widecheck";
      return {
        type: "accent",
        mode: context.parser.mode,
        label: context.funcName,
        isStretchy,
        isShifty,
        base
      };
    },
    htmlBuilder: htmlBuilder$a,
    mathmlBuilder: mathmlBuilder$9
  });
  defineFunction({
    type: "accent",
    names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
    props: {
      numArgs: 1,
      allowedInText: true,
      allowedInMath: true,
      // unless in strict mode
      argTypes: ["primitive"]
    },
    handler: (context, args) => {
      var base = args[0];
      var mode = context.parser.mode;
      if (mode === "math") {
        context.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + context.funcName + " works only in text mode");
        mode = "text";
      }
      return {
        type: "accent",
        mode,
        label: context.funcName,
        isStretchy: false,
        isShifty: true,
        base
      };
    },
    htmlBuilder: htmlBuilder$a,
    mathmlBuilder: mathmlBuilder$9
  });
  defineFunction({
    type: "accentUnder",
    names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
    props: {
      numArgs: 1
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var base = args[0];
      return {
        type: "accentUnder",
        mode: parser.mode,
        label: funcName,
        base
      };
    },
    htmlBuilder: (group, options) => {
      var innerGroup = buildGroup$1(group.base, options);
      var accentBody = stretchySvg(group, options);
      var kern = group.label === "\\utilde" ? 0.12 : 0;
      var vlist = makeVList({
        positionType: "top",
        positionData: innerGroup.height,
        children: [{
          type: "elem",
          elem: accentBody,
          wrapperClasses: ["svg-align"]
        }, {
          type: "kern",
          size: kern
        }, {
          type: "elem",
          elem: innerGroup
        }]
      });
      return makeSpan(["mord", "accentunder"], [vlist], options);
    },
    mathmlBuilder: (group, options) => {
      var accentNode = stretchyMathML(group.label);
      var node = new MathNode("munder", [buildGroup2(group.base, options), accentNode]);
      node.setAttribute("accentunder", "true");
      return node;
    }
  });
  var paddedNode = (group) => {
    var node = new MathNode("mpadded", group ? [group] : []);
    node.setAttribute("width", "+0.6em");
    node.setAttribute("lspace", "0.3em");
    return node;
  };
  defineFunction({
    type: "xArrow",
    names: [
      "\\xleftarrow",
      "\\xrightarrow",
      "\\xLeftarrow",
      "\\xRightarrow",
      "\\xleftrightarrow",
      "\\xLeftrightarrow",
      "\\xhookleftarrow",
      "\\xhookrightarrow",
      "\\xmapsto",
      "\\xrightharpoondown",
      "\\xrightharpoonup",
      "\\xleftharpoondown",
      "\\xleftharpoonup",
      "\\xrightleftharpoons",
      "\\xleftrightharpoons",
      "\\xlongequal",
      "\\xtwoheadrightarrow",
      "\\xtwoheadleftarrow",
      "\\xtofrom",
      // The next 3 functions are here to support the mhchem extension.
      // Direct use of these functions is discouraged and may break someday.
      "\\xrightleftarrows",
      "\\xrightequilibrium",
      "\\xleftequilibrium",
      // The next 3 functions are here only to support the {CD} environment.
      "\\\\cdrightarrow",
      "\\\\cdleftarrow",
      "\\\\cdlongequal"
    ],
    props: {
      numArgs: 1,
      numOptionalArgs: 1
    },
    handler(_ref, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "xArrow",
        mode: parser.mode,
        label: funcName,
        body: args[0],
        below: optArgs[0]
      };
    },
    htmlBuilder(group, options) {
      var style = options.style;
      var newOptions = options.havingStyle(style.sup());
      var upperGroup = wrapFragment(buildGroup$1(group.body, newOptions, options), options);
      var arrowPrefix = group.label.slice(0, 2) === "\\x" ? "x" : "cd";
      upperGroup.classes.push(arrowPrefix + "-arrow-pad");
      var lowerGroup;
      if (group.below) {
        newOptions = options.havingStyle(style.sub());
        lowerGroup = wrapFragment(buildGroup$1(group.below, newOptions, options), options);
        lowerGroup.classes.push(arrowPrefix + "-arrow-pad");
      }
      var arrowBody = stretchySvg(group, options);
      var arrowShift = -options.fontMetrics().axisHeight + 0.5 * arrowBody.height;
      var upperShift = -options.fontMetrics().axisHeight - 0.5 * arrowBody.height - 0.111;
      if (upperGroup.depth > 0.25 || group.label === "\\xleftequilibrium") {
        upperShift -= upperGroup.depth;
      }
      var vlist;
      if (lowerGroup) {
        var lowerShift = -options.fontMetrics().axisHeight + lowerGroup.height + 0.5 * arrowBody.height + 0.111;
        vlist = makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: upperGroup,
            shift: upperShift
          }, {
            type: "elem",
            elem: arrowBody,
            shift: arrowShift,
            wrapperClasses: ["svg-align"]
          }, {
            type: "elem",
            elem: lowerGroup,
            shift: lowerShift
          }]
        });
      } else {
        vlist = makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: upperGroup,
            shift: upperShift
          }, {
            type: "elem",
            elem: arrowBody,
            shift: arrowShift,
            wrapperClasses: ["svg-align"]
          }]
        });
      }
      return makeSpan(["mrel", "x-arrow"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var arrowNode = stretchyMathML(group.label);
      arrowNode.setAttribute("minsize", group.label.charAt(0) === "x" ? "1.75em" : "3.0em");
      var node;
      if (group.body) {
        var upperNode = paddedNode(buildGroup2(group.body, options));
        if (group.below) {
          var lowerNode = paddedNode(buildGroup2(group.below, options));
          node = new MathNode("munderover", [arrowNode, lowerNode, upperNode]);
        } else {
          node = new MathNode("mover", [arrowNode, upperNode]);
        }
      } else if (group.below) {
        var _lowerNode = paddedNode(buildGroup2(group.below, options));
        node = new MathNode("munder", [arrowNode, _lowerNode]);
      } else {
        node = paddedNode();
        node = new MathNode("mover", [arrowNode, node]);
      }
      return node;
    }
  });
  function htmlBuilder$9(group, options) {
    var elements = buildExpression$1(group.body, options, true);
    return makeSpan([group.mclass], elements, options);
  }
  function mathmlBuilder$8(group, options) {
    var node;
    var inner2 = buildExpression2(group.body, options);
    if (group.mclass === "minner") {
      node = new MathNode("mpadded", inner2);
    } else if (group.mclass === "mord") {
      if (group.isCharacterBox) {
        node = inner2[0];
        node.type = "mi";
      } else {
        node = new MathNode("mi", inner2);
      }
    } else {
      if (group.isCharacterBox) {
        node = inner2[0];
        node.type = "mo";
      } else {
        node = new MathNode("mo", inner2);
      }
      if (group.mclass === "mbin") {
        node.attributes.lspace = "0.22em";
        node.attributes.rspace = "0.22em";
      } else if (group.mclass === "mpunct") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = "0.17em";
      } else if (group.mclass === "mopen" || group.mclass === "mclose") {
        node.attributes.lspace = "0em";
        node.attributes.rspace = "0em";
      } else if (group.mclass === "minner") {
        node.attributes.lspace = "0.0556em";
        node.attributes.width = "+0.1111em";
      }
    }
    return node;
  }
  defineFunction({
    type: "mclass",
    names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var body = args[0];
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: "m" + funcName.slice(5),
        // TODO(kevinb): don't prefix with 'm'
        body: ordargument(body),
        isCharacterBox: isCharacterBox(body)
      };
    },
    htmlBuilder: htmlBuilder$9,
    mathmlBuilder: mathmlBuilder$8
  });
  var binrelClass = (arg) => {
    var atom = arg.type === "ordgroup" && arg.body.length ? arg.body[0] : arg;
    if (atom.type === "atom" && (atom.family === "bin" || atom.family === "rel")) {
      return "m" + atom.family;
    } else {
      return "mord";
    }
  };
  defineFunction({
    type: "mclass",
    names: ["\\@binrel"],
    props: {
      numArgs: 2
    },
    handler(_ref2, args) {
      var {
        parser
      } = _ref2;
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: binrelClass(args[0]),
        body: ordargument(args[1]),
        isCharacterBox: isCharacterBox(args[1])
      };
    }
  });
  defineFunction({
    type: "mclass",
    names: ["\\stackrel", "\\overset", "\\underset"],
    props: {
      numArgs: 2
    },
    handler(_ref3, args) {
      var {
        parser,
        funcName
      } = _ref3;
      var baseArg = args[1];
      var shiftedArg = args[0];
      var mclass;
      if (funcName !== "\\stackrel") {
        mclass = binrelClass(baseArg);
      } else {
        mclass = "mrel";
      }
      var baseOp = {
        type: "op",
        mode: baseArg.mode,
        limits: true,
        alwaysHandleSupSub: true,
        parentIsSupSub: false,
        symbol: false,
        suppressBaseShift: funcName !== "\\stackrel",
        body: ordargument(baseArg)
      };
      var supsub = {
        type: "supsub",
        mode: shiftedArg.mode,
        base: baseOp,
        sup: funcName === "\\underset" ? null : shiftedArg,
        sub: funcName === "\\underset" ? shiftedArg : null
      };
      return {
        type: "mclass",
        mode: parser.mode,
        mclass,
        body: [supsub],
        isCharacterBox: isCharacterBox(supsub)
      };
    },
    htmlBuilder: htmlBuilder$9,
    mathmlBuilder: mathmlBuilder$8
  });
  defineFunction({
    type: "pmb",
    names: ["\\pmb"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "pmb",
        mode: parser.mode,
        mclass: binrelClass(args[0]),
        body: ordargument(args[0])
      };
    },
    htmlBuilder(group, options) {
      var elements = buildExpression$1(group.body, options, true);
      var node = makeSpan([group.mclass], elements, options);
      node.style.textShadow = "0.02em 0.01em 0.04px";
      return node;
    },
    mathmlBuilder(group, style) {
      var inner2 = buildExpression2(group.body, style);
      var node = new MathNode("mstyle", inner2);
      node.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px");
      return node;
    }
  });
  var cdArrowFunctionName = {
    ">": "\\\\cdrightarrow",
    "<": "\\\\cdleftarrow",
    "=": "\\\\cdlongequal",
    "A": "\\uparrow",
    "V": "\\downarrow",
    "|": "\\Vert",
    ".": "no arrow"
  };
  var newCell = () => {
    return {
      type: "styling",
      body: [],
      mode: "math",
      style: "display",
      resetFont: true
    };
  };
  var isStartOfArrow = (node) => {
    return node.type === "textord" && node.text === "@";
  };
  var isLabelEnd = (node, endChar) => {
    return (node.type === "mathord" || node.type === "atom") && node.text === endChar;
  };
  function cdArrow(arrowChar, labels, parser) {
    var funcName = cdArrowFunctionName[arrowChar];
    switch (funcName) {
      case "\\\\cdrightarrow":
      case "\\\\cdleftarrow":
        return parser.callFunction(funcName, [labels[0]], [labels[1]]);
      case "\\uparrow":
      case "\\downarrow": {
        var leftLabel = parser.callFunction("\\\\cdleft", [labels[0]], []);
        var bareArrow = {
          type: "atom",
          text: funcName,
          mode: "math",
          family: "rel"
        };
        var sizedArrow = parser.callFunction("\\Big", [bareArrow], []);
        var rightLabel = parser.callFunction("\\\\cdright", [labels[1]], []);
        var arrowGroup = {
          type: "ordgroup",
          mode: "math",
          body: [leftLabel, sizedArrow, rightLabel]
        };
        return parser.callFunction("\\\\cdparent", [arrowGroup], []);
      }
      case "\\\\cdlongequal":
        return parser.callFunction("\\\\cdlongequal", [], []);
      case "\\Vert": {
        var arrow = {
          type: "textord",
          text: "\\Vert",
          mode: "math"
        };
        return parser.callFunction("\\Big", [arrow], []);
      }
      default:
        return {
          type: "textord",
          text: " ",
          mode: "math"
        };
    }
  }
  function parseCD(parser) {
    var parsedRows = [];
    parser.gullet.beginGroup();
    parser.gullet.macros.set("\\cr", "\\\\\\relax");
    parser.gullet.beginGroup();
    while (true) {
      parsedRows.push(parser.parseExpression(false, "\\\\"));
      parser.gullet.endGroup();
      parser.gullet.beginGroup();
      var next = parser.fetch().text;
      if (next === "&" || next === "\\\\") {
        parser.consume();
      } else if (next === "\\end") {
        if (parsedRows[parsedRows.length - 1].length === 0) {
          parsedRows.pop();
        }
        break;
      } else {
        throw new ParseError("Expected \\\\ or \\cr or \\end", parser.nextToken);
      }
    }
    var row = [];
    var body = [row];
    for (var i = 0; i < parsedRows.length; i++) {
      var rowNodes = parsedRows[i];
      var cell = newCell();
      for (var j3 = 0; j3 < rowNodes.length; j3++) {
        if (!isStartOfArrow(rowNodes[j3])) {
          cell.body.push(rowNodes[j3]);
        } else {
          row.push(cell);
          j3 += 1;
          var arrowChar = assertSymbolNodeType(rowNodes[j3]).text;
          var labels = new Array(2);
          labels[0] = {
            type: "ordgroup",
            mode: "math",
            body: []
          };
          labels[1] = {
            type: "ordgroup",
            mode: "math",
            body: []
          };
          if ("=|.".includes(arrowChar)) ;
          else if ("<>AV".includes(arrowChar)) {
            for (var labelNum = 0; labelNum < 2; labelNum++) {
              var inLabel = true;
              for (var k3 = j3 + 1; k3 < rowNodes.length; k3++) {
                if (isLabelEnd(rowNodes[k3], arrowChar)) {
                  inLabel = false;
                  j3 = k3;
                  break;
                }
                if (isStartOfArrow(rowNodes[k3])) {
                  throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[k3]);
                }
                labels[labelNum].body.push(rowNodes[k3]);
              }
              if (inLabel) {
                throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[j3]);
              }
            }
          } else {
            throw new ParseError('Expected one of "<>AV=|." after @', rowNodes[j3]);
          }
          var arrow = cdArrow(arrowChar, labels, parser);
          var wrappedArrow = {
            type: "styling",
            body: [arrow],
            mode: "math",
            style: "display",
            // CD is always displaystyle.
            resetFont: true
          };
          row.push(wrappedArrow);
          cell = newCell();
        }
      }
      if (i % 2 === 0) {
        row.push(cell);
      } else {
        row.shift();
      }
      row = [];
      body.push(row);
    }
    parser.gullet.endGroup();
    parser.gullet.endGroup();
    var cols = new Array(body[0].length).fill({
      type: "align",
      align: "c",
      pregap: 0.25,
      // CD package sets \enskip between columns.
      postgap: 0.25
      // So pre and post each get half an \enskip, i.e. 0.25em.
    });
    return {
      type: "array",
      mode: "math",
      body,
      arraystretch: 1,
      addJot: true,
      rowGaps: [null],
      cols,
      colSeparationType: "CD",
      hLinesBeforeRow: new Array(body.length + 1).fill([])
    };
  }
  defineFunction({
    type: "cdlabel",
    names: ["\\\\cdleft", "\\\\cdright"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "cdlabel",
        mode: parser.mode,
        side: funcName.slice(4),
        label: args[0]
      };
    },
    htmlBuilder(group, options) {
      var newOptions = options.havingStyle(options.style.sup());
      var label = wrapFragment(buildGroup$1(group.label, newOptions, options), options);
      label.classes.push("cd-label-" + group.side);
      label.style.bottom = makeEm(0.8 - label.depth);
      label.height = 0;
      label.depth = 0;
      return label;
    },
    mathmlBuilder(group, options) {
      var label = new MathNode("mrow", [buildGroup2(group.label, options)]);
      label = new MathNode("mpadded", [label]);
      label.setAttribute("width", "0");
      if (group.side === "left") {
        label.setAttribute("lspace", "-1width");
      }
      label.setAttribute("voffset", "0.7em");
      label = new MathNode("mstyle", [label]);
      label.setAttribute("displaystyle", "false");
      label.setAttribute("scriptlevel", "1");
      return label;
    }
  });
  defineFunction({
    type: "cdlabelparent",
    names: ["\\\\cdparent"],
    props: {
      numArgs: 1
    },
    handler(_ref2, args) {
      var {
        parser
      } = _ref2;
      return {
        type: "cdlabelparent",
        mode: parser.mode,
        fragment: args[0]
      };
    },
    htmlBuilder(group, options) {
      var parent = wrapFragment(buildGroup$1(group.fragment, options), options);
      parent.classes.push("cd-vert-arrow");
      return parent;
    },
    mathmlBuilder(group, options) {
      return new MathNode("mrow", [buildGroup2(group.fragment, options)]);
    }
  });
  defineFunction({
    type: "textord",
    names: ["\\@char"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var arg = assertNodeType(args[0], "ordgroup");
      var group = arg.body;
      var number = "";
      for (var i = 0; i < group.length; i++) {
        var node = assertNodeType(group[i], "textord");
        number += node.text;
      }
      var code = parseInt(number);
      var text4;
      if (isNaN(code)) {
        throw new ParseError("\\@char has non-numeric argument " + number);
      } else if (code < 0 || code >= 1114111) {
        throw new ParseError("\\@char with invalid code point " + number);
      } else if (code <= 65535) {
        text4 = String.fromCharCode(code);
      } else {
        code -= 65536;
        text4 = String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
      }
      return {
        type: "textord",
        mode: parser.mode,
        text: text4
      };
    }
  });
  var htmlBuilder$8 = (group, options) => {
    var elements = buildExpression$1(group.body, options.withColor(group.color), false);
    return makeFragment(elements);
  };
  var mathmlBuilder$7 = (group, options) => {
    var inner2 = buildExpression2(group.body, options.withColor(group.color));
    var node = new MathNode("mstyle", inner2);
    node.setAttribute("mathcolor", group.color);
    return node;
  };
  defineFunction({
    type: "color",
    names: ["\\textcolor"],
    props: {
      numArgs: 2,
      allowedInText: true,
      argTypes: ["color", "original"]
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var color = assertNodeType(args[0], "color-token").color;
      var body = args[1];
      return {
        type: "color",
        mode: parser.mode,
        color,
        body: ordargument(body)
      };
    },
    htmlBuilder: htmlBuilder$8,
    mathmlBuilder: mathmlBuilder$7
  });
  defineFunction({
    type: "color",
    names: ["\\color"],
    props: {
      numArgs: 1,
      allowedInText: true,
      argTypes: ["color"]
    },
    handler(_ref2, args) {
      var {
        parser,
        breakOnTokenText
      } = _ref2;
      var color = assertNodeType(args[0], "color-token").color;
      parser.gullet.macros.set("\\current@color", color);
      var body = parser.parseExpression(true, breakOnTokenText);
      return {
        type: "color",
        mode: parser.mode,
        color,
        body
      };
    },
    htmlBuilder: htmlBuilder$8,
    mathmlBuilder: mathmlBuilder$7
  });
  defineFunction({
    type: "cr",
    names: ["\\\\"],
    props: {
      numArgs: 0,
      numOptionalArgs: 0,
      allowedInText: true
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var size = parser.gullet.future().text === "[" ? parser.parseSizeGroup(true) : null;
      var newLine = !parser.settings.displayMode || !parser.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
      return {
        type: "cr",
        mode: parser.mode,
        newLine,
        size: size && assertNodeType(size, "size").value
      };
    },
    // The following builders are called only at the top level,
    // not within tabular/array environments.
    htmlBuilder(group, options) {
      var span = makeSpan(["mspace"], [], options);
      if (group.newLine) {
        span.classes.push("newline");
        if (group.size) {
          span.style.marginTop = makeEm(calculateSize(group.size, options));
        }
      }
      return span;
    },
    mathmlBuilder(group, options) {
      var node = new MathNode("mspace");
      if (group.newLine) {
        node.setAttribute("linebreak", "newline");
        if (group.size) {
          node.setAttribute("height", makeEm(calculateSize(group.size, options)));
        }
      }
      return node;
    }
  });
  var globalMap = {
    "\\global": "\\global",
    "\\long": "\\\\globallong",
    "\\\\globallong": "\\\\globallong",
    "\\def": "\\gdef",
    "\\gdef": "\\gdef",
    "\\edef": "\\xdef",
    "\\xdef": "\\xdef",
    "\\let": "\\\\globallet",
    "\\futurelet": "\\\\globalfuture"
  };
  var checkControlSequence = (tok) => {
    var name = tok.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) {
      throw new ParseError("Expected a control sequence", tok);
    }
    return name;
  };
  var getRHS = (parser) => {
    var tok = parser.gullet.popToken();
    if (tok.text === "=") {
      tok = parser.gullet.popToken();
      if (tok.text === " ") {
        tok = parser.gullet.popToken();
      }
    }
    return tok;
  };
  var letCommand = (parser, name, tok, global) => {
    var macro = parser.gullet.macros.get(tok.text);
    if (macro == null) {
      tok.noexpand = true;
      macro = {
        tokens: [tok],
        numArgs: 0,
        // reproduce the same behavior in expansion
        unexpandable: !parser.gullet.isExpandable(tok.text)
      };
    }
    parser.gullet.macros.set(name, macro, global);
  };
  defineFunction({
    type: "internal",
    names: [
      "\\global",
      "\\long",
      "\\\\globallong"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler(_ref) {
      var {
        parser,
        funcName
      } = _ref;
      parser.consumeSpaces();
      var token = parser.fetch();
      if (globalMap[token.text]) {
        if (funcName === "\\global" || funcName === "\\\\globallong") {
          token.text = globalMap[token.text];
        }
        return assertNodeType(parser.parseFunction(), "internal");
      }
      throw new ParseError("Invalid token after macro prefix", token);
    }
  });
  defineFunction({
    type: "internal",
    names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref2) {
      var {
        parser,
        funcName
      } = _ref2;
      var tok = parser.gullet.popToken();
      var name = tok.text;
      if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) {
        throw new ParseError("Expected a control sequence", tok);
      }
      var numArgs = 0;
      var insert;
      var delimiters2 = [[]];
      while (parser.gullet.future().text !== "{") {
        tok = parser.gullet.popToken();
        if (tok.text === "#") {
          if (parser.gullet.future().text === "{") {
            insert = parser.gullet.future();
            delimiters2[numArgs].push("{");
            break;
          }
          tok = parser.gullet.popToken();
          if (!/^[1-9]$/.test(tok.text)) {
            throw new ParseError('Invalid argument number "' + tok.text + '"');
          }
          if (parseInt(tok.text) !== numArgs + 1) {
            throw new ParseError('Argument number "' + tok.text + '" out of order');
          }
          numArgs++;
          delimiters2.push([]);
        } else if (tok.text === "EOF") {
          throw new ParseError("Expected a macro definition");
        } else {
          delimiters2[numArgs].push(tok.text);
        }
      }
      var {
        tokens
      } = parser.gullet.consumeArg();
      if (insert) {
        tokens.unshift(insert);
      }
      if (funcName === "\\edef" || funcName === "\\xdef") {
        tokens = parser.gullet.expandTokens(tokens);
        tokens.reverse();
      }
      parser.gullet.macros.set(name, {
        tokens,
        numArgs,
        delimiters: delimiters2
      }, funcName === globalMap[funcName]);
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "internal",
    names: [
      "\\let",
      "\\\\globallet"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref3) {
      var {
        parser,
        funcName
      } = _ref3;
      var name = checkControlSequence(parser.gullet.popToken());
      parser.gullet.consumeSpaces();
      var tok = getRHS(parser);
      letCommand(parser, name, tok, funcName === "\\\\globallet");
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "internal",
    names: [
      "\\futurelet",
      "\\\\globalfuture"
      // can’t be entered directly
    ],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref4) {
      var {
        parser,
        funcName
      } = _ref4;
      var name = checkControlSequence(parser.gullet.popToken());
      var middle = parser.gullet.popToken();
      var tok = parser.gullet.popToken();
      letCommand(parser, name, tok, funcName === "\\\\globalfuture");
      parser.gullet.pushToken(tok);
      parser.gullet.pushToken(middle);
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  var getMetrics = function getMetrics2(symbol, font, mode) {
    var replace = symbols.math[symbol] && symbols.math[symbol].replace;
    var metrics = getCharacterMetrics(replace || symbol, font, mode);
    if (!metrics) {
      throw new Error("Unsupported symbol " + symbol + " and font size " + font + ".");
    }
    return metrics;
  };
  var styleWrap = function styleWrap2(delim, toStyle, options, classes) {
    var newOptions = options.havingBaseStyle(toStyle);
    var span = makeSpan(classes.concat(newOptions.sizingClasses(options)), [delim], options);
    var delimSizeMultiplier = newOptions.sizeMultiplier / options.sizeMultiplier;
    span.height *= delimSizeMultiplier;
    span.depth *= delimSizeMultiplier;
    span.maxFontSize = newOptions.sizeMultiplier;
    return span;
  };
  var centerSpan = function centerSpan2(span, options, style) {
    var newOptions = options.havingBaseStyle(style);
    var shift = (1 - options.sizeMultiplier / newOptions.sizeMultiplier) * options.fontMetrics().axisHeight;
    span.classes.push("delimcenter");
    span.style.top = makeEm(shift);
    span.height -= shift;
    span.depth += shift;
  };
  var makeSmallDelim = function makeSmallDelim2(delim, style, center, options, mode, classes) {
    var text4 = makeSymbol(delim, "Main-Regular", mode, options);
    var span = styleWrap(text4, style, options, classes);
    if (center) {
      centerSpan(span, options, style);
    }
    return span;
  };
  var mathrmSize = function mathrmSize2(value, size, mode, options) {
    return makeSymbol(value, "Size" + size + "-Regular", mode, options);
  };
  var makeLargeDelim = function makeLargeDelim2(delim, size, center, options, mode, classes) {
    var inner2 = mathrmSize(delim, size, mode, options);
    var span = styleWrap(makeSpan(["delimsizing", "size" + size], [inner2], options), Style$1.TEXT, options, classes);
    if (center) {
      centerSpan(span, options, Style$1.TEXT);
    }
    return span;
  };
  var makeGlyphSpan = function makeGlyphSpan2(symbol, font, mode) {
    var sizeClass;
    if (font === "Size1-Regular") {
      sizeClass = "delim-size1";
    } else {
      sizeClass = "delim-size4";
    }
    var corner = makeSpan(["delimsizinginner", sizeClass], [makeSpan([], [makeSymbol(symbol, font, mode)])]);
    return {
      type: "elem",
      elem: corner
    };
  };
  var makeInner = function makeInner2(ch, height, options) {
    var width = fontMetricsData["Size4-Regular"][ch.charCodeAt(0)] ? fontMetricsData["Size4-Regular"][ch.charCodeAt(0)][4] : fontMetricsData["Size1-Regular"][ch.charCodeAt(0)][4];
    var path2 = new PathNode("inner", innerPath(ch, Math.round(1e3 * height)));
    var svgNode = new SvgNode([path2], {
      "width": makeEm(width),
      "height": makeEm(height),
      // Override CSS rule `.katex svg { width: 100% }`
      "style": "width:" + makeEm(width),
      "viewBox": "0 0 " + 1e3 * width + " " + Math.round(1e3 * height),
      "preserveAspectRatio": "xMinYMin"
    });
    var span = makeSvgSpan([], [svgNode], options);
    span.height = height;
    span.style.height = makeEm(height);
    span.style.width = makeEm(width);
    return {
      type: "elem",
      elem: span
    };
  };
  var lapInEms = 8e-3;
  var lap = {
    type: "kern",
    size: -1 * lapInEms
  };
  var verts = /* @__PURE__ */ new Set(["|", "\\lvert", "\\rvert", "\\vert"]);
  var doubleVerts = /* @__PURE__ */ new Set(["\\|", "\\lVert", "\\rVert", "\\Vert"]);
  var makeStackedDelim = function makeStackedDelim2(delim, heightTotal, center, options, mode, classes) {
    var top;
    var middle;
    var repeat;
    var bottom;
    var svgLabel = "";
    var viewBoxWidth = 0;
    top = repeat = bottom = delim;
    middle = null;
    var font = "Size1-Regular";
    if (delim === "\\uparrow") {
      repeat = bottom = "\u23D0";
    } else if (delim === "\\Uparrow") {
      repeat = bottom = "\u2016";
    } else if (delim === "\\downarrow") {
      top = repeat = "\u23D0";
    } else if (delim === "\\Downarrow") {
      top = repeat = "\u2016";
    } else if (delim === "\\updownarrow") {
      top = "\\uparrow";
      repeat = "\u23D0";
      bottom = "\\downarrow";
    } else if (delim === "\\Updownarrow") {
      top = "\\Uparrow";
      repeat = "\u2016";
      bottom = "\\Downarrow";
    } else if (verts.has(delim)) {
      repeat = "\u2223";
      svgLabel = "vert";
      viewBoxWidth = 333;
    } else if (doubleVerts.has(delim)) {
      repeat = "\u2225";
      svgLabel = "doublevert";
      viewBoxWidth = 556;
    } else if (delim === "[" || delim === "\\lbrack") {
      top = "\u23A1";
      repeat = "\u23A2";
      bottom = "\u23A3";
      font = "Size4-Regular";
      svgLabel = "lbrack";
      viewBoxWidth = 667;
    } else if (delim === "]" || delim === "\\rbrack") {
      top = "\u23A4";
      repeat = "\u23A5";
      bottom = "\u23A6";
      font = "Size4-Regular";
      svgLabel = "rbrack";
      viewBoxWidth = 667;
    } else if (delim === "\\lfloor" || delim === "\u230A") {
      repeat = top = "\u23A2";
      bottom = "\u23A3";
      font = "Size4-Regular";
      svgLabel = "lfloor";
      viewBoxWidth = 667;
    } else if (delim === "\\lceil" || delim === "\u2308") {
      top = "\u23A1";
      repeat = bottom = "\u23A2";
      font = "Size4-Regular";
      svgLabel = "lceil";
      viewBoxWidth = 667;
    } else if (delim === "\\rfloor" || delim === "\u230B") {
      repeat = top = "\u23A5";
      bottom = "\u23A6";
      font = "Size4-Regular";
      svgLabel = "rfloor";
      viewBoxWidth = 667;
    } else if (delim === "\\rceil" || delim === "\u2309") {
      top = "\u23A4";
      repeat = bottom = "\u23A5";
      font = "Size4-Regular";
      svgLabel = "rceil";
      viewBoxWidth = 667;
    } else if (delim === "(" || delim === "\\lparen") {
      top = "\u239B";
      repeat = "\u239C";
      bottom = "\u239D";
      font = "Size4-Regular";
      svgLabel = "lparen";
      viewBoxWidth = 875;
    } else if (delim === ")" || delim === "\\rparen") {
      top = "\u239E";
      repeat = "\u239F";
      bottom = "\u23A0";
      font = "Size4-Regular";
      svgLabel = "rparen";
      viewBoxWidth = 875;
    } else if (delim === "\\{" || delim === "\\lbrace") {
      top = "\u23A7";
      middle = "\u23A8";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\}" || delim === "\\rbrace") {
      top = "\u23AB";
      middle = "\u23AC";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\lgroup" || delim === "\u27EE") {
      top = "\u23A7";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\rgroup" || delim === "\u27EF") {
      top = "\u23AB";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\lmoustache" || delim === "\u23B0") {
      top = "\u23A7";
      bottom = "\u23AD";
      repeat = "\u23AA";
      font = "Size4-Regular";
    } else if (delim === "\\rmoustache" || delim === "\u23B1") {
      top = "\u23AB";
      bottom = "\u23A9";
      repeat = "\u23AA";
      font = "Size4-Regular";
    }
    var topMetrics = getMetrics(top, font, mode);
    var topHeightTotal = topMetrics.height + topMetrics.depth;
    var repeatMetrics = getMetrics(repeat, font, mode);
    var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
    var bottomMetrics = getMetrics(bottom, font, mode);
    var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
    var middleHeightTotal = 0;
    var middleFactor = 1;
    if (middle !== null) {
      var middleMetrics = getMetrics(middle, font, mode);
      middleHeightTotal = middleMetrics.height + middleMetrics.depth;
      middleFactor = 2;
    }
    var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;
    var repeatCount = Math.max(0, Math.ceil((heightTotal - minHeight) / (middleFactor * repeatHeightTotal)));
    var realHeightTotal = minHeight + repeatCount * middleFactor * repeatHeightTotal;
    var axisHeight = options.fontMetrics().axisHeight;
    if (center) {
      axisHeight *= options.sizeMultiplier;
    }
    var depth = realHeightTotal / 2 - axisHeight;
    var stack = [];
    if (svgLabel.length > 0) {
      var midHeight = realHeightTotal - topHeightTotal - bottomHeightTotal;
      var viewBoxHeight = Math.round(realHeightTotal * 1e3);
      var pathStr = tallDelim(svgLabel, Math.round(midHeight * 1e3));
      var path2 = new PathNode(svgLabel, pathStr);
      var width = makeEm(viewBoxWidth / 1e3);
      var height = makeEm(viewBoxHeight / 1e3);
      var svg = new SvgNode([path2], {
        "width": width,
        "height": height,
        "viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight
      });
      var wrapper = makeSvgSpan([], [svg], options);
      wrapper.height = viewBoxHeight / 1e3;
      wrapper.style.width = width;
      wrapper.style.height = height;
      stack.push({
        type: "elem",
        elem: wrapper
      });
    } else {
      stack.push(makeGlyphSpan(bottom, font, mode));
      stack.push(lap);
      if (middle === null) {
        var innerHeight = realHeightTotal - topHeightTotal - bottomHeightTotal + 2 * lapInEms;
        stack.push(makeInner(repeat, innerHeight, options));
      } else {
        var _innerHeight = (realHeightTotal - topHeightTotal - bottomHeightTotal - middleHeightTotal) / 2 + 2 * lapInEms;
        stack.push(makeInner(repeat, _innerHeight, options));
        stack.push(lap);
        stack.push(makeGlyphSpan(middle, font, mode));
        stack.push(lap);
        stack.push(makeInner(repeat, _innerHeight, options));
      }
      stack.push(lap);
      stack.push(makeGlyphSpan(top, font, mode));
    }
    var newOptions = options.havingBaseStyle(Style$1.TEXT);
    var inner2 = makeVList({
      positionType: "bottom",
      positionData: depth,
      children: stack
    });
    return styleWrap(makeSpan(["delimsizing", "mult"], [inner2], newOptions), Style$1.TEXT, options, classes);
  };
  var vbPad = 80;
  var emPad = 0.08;
  var sqrtSvg = function sqrtSvg2(sqrtName, height, viewBoxHeight, extraVinculum, options) {
    var path2 = sqrtPath(sqrtName, extraVinculum, viewBoxHeight);
    var pathNode = new PathNode(sqrtName, path2);
    var svg = new SvgNode([pathNode], {
      // Note: 1000:1 ratio of viewBox to document em width.
      "width": "400em",
      "height": makeEm(height),
      "viewBox": "0 0 400000 " + viewBoxHeight,
      "preserveAspectRatio": "xMinYMin slice"
    });
    return makeSvgSpan(["hide-tail"], [svg], options);
  };
  var makeSqrtImage = function makeSqrtImage2(height, options) {
    var newOptions = options.havingBaseSizing();
    var delim = traverseSequence("\\surd", height * newOptions.sizeMultiplier, stackLargeDelimiterSequence, newOptions);
    var sizeMultiplier = newOptions.sizeMultiplier;
    var extraVinculum = Math.max(0, options.minRuleThickness - options.fontMetrics().sqrtRuleThickness);
    var span;
    var spanHeight;
    var texHeight;
    var viewBoxHeight;
    var advanceWidth;
    if (delim.type === "small") {
      viewBoxHeight = 1e3 + 1e3 * extraVinculum + vbPad;
      if (height < 1) {
        sizeMultiplier = 1;
      } else if (height < 1.4) {
        sizeMultiplier = 0.7;
      }
      spanHeight = (1 + extraVinculum + emPad) / sizeMultiplier;
      texHeight = (1 + extraVinculum) / sizeMultiplier;
      span = sqrtSvg("sqrtMain", spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "0.853em";
      advanceWidth = 0.833 / sizeMultiplier;
    } else if (delim.type === "large") {
      viewBoxHeight = (1e3 + vbPad) * sizeToMaxHeight[delim.size];
      texHeight = (sizeToMaxHeight[delim.size] + extraVinculum) / sizeMultiplier;
      spanHeight = (sizeToMaxHeight[delim.size] + extraVinculum + emPad) / sizeMultiplier;
      span = sqrtSvg("sqrtSize" + delim.size, spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "1.02em";
      advanceWidth = 1 / sizeMultiplier;
    } else {
      spanHeight = height + extraVinculum + emPad;
      texHeight = height + extraVinculum;
      viewBoxHeight = Math.floor(1e3 * height + extraVinculum) + vbPad;
      span = sqrtSvg("sqrtTall", spanHeight, viewBoxHeight, extraVinculum, options);
      span.style.minWidth = "0.742em";
      advanceWidth = 1.056;
    }
    span.height = texHeight;
    span.style.height = makeEm(spanHeight);
    return {
      span,
      advanceWidth,
      // Calculate the actual line width.
      // This actually should depend on the chosen font -- e.g. \boldmath
      // should use the thicker surd symbols from e.g. KaTeX_Main-Bold, and
      // have thicker rules.
      ruleWidth: (options.fontMetrics().sqrtRuleThickness + extraVinculum) * sizeMultiplier
    };
  };
  var stackLargeDelimiters = /* @__PURE__ */ new Set(["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "\\surd"]);
  var stackAlwaysDelimiters = /* @__PURE__ */ new Set(["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1"]);
  var stackNeverDelimiters = /* @__PURE__ */ new Set(["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"]);
  var sizeToMaxHeight = [0, 1.2, 1.8, 2.4, 3];
  var makeSizedDelim = function makeSizedDelim2(delim, size, options, mode, classes) {
    if (delim === "<" || delim === "\\lt" || delim === "\u27E8") {
      delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt" || delim === "\u27E9") {
      delim = "\\rangle";
    }
    if (stackLargeDelimiters.has(delim) || stackNeverDelimiters.has(delim)) {
      return makeLargeDelim(delim, size, false, options, mode, classes);
    } else if (stackAlwaysDelimiters.has(delim)) {
      return makeStackedDelim(delim, sizeToMaxHeight[size], false, options, mode, classes);
    } else {
      throw new ParseError("Illegal delimiter: '" + delim + "'");
    }
  };
  var stackNeverDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "large",
    size: 1
  }, {
    type: "large",
    size: 2
  }, {
    type: "large",
    size: 3
  }, {
    type: "large",
    size: 4
  }];
  var stackAlwaysDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "stack"
  }];
  var stackLargeDelimiterSequence = [{
    type: "small",
    style: Style$1.SCRIPTSCRIPT
  }, {
    type: "small",
    style: Style$1.SCRIPT
  }, {
    type: "small",
    style: Style$1.TEXT
  }, {
    type: "large",
    size: 1
  }, {
    type: "large",
    size: 2
  }, {
    type: "large",
    size: 3
  }, {
    type: "large",
    size: 4
  }, {
    type: "stack"
  }];
  var delimTypeToFont = function delimTypeToFont2(type) {
    if (type.type === "small") {
      return "Main-Regular";
    } else if (type.type === "large") {
      return "Size" + type.size + "-Regular";
    } else if (type.type === "stack") {
      return "Size4-Regular";
    } else {
      var delimKind = type.type;
      throw new Error("Add support for delim type '" + delimKind + "' here.");
    }
  };
  var traverseSequence = function traverseSequence2(delim, height, sequence, options) {
    var start = Math.min(2, 3 - options.style.size);
    for (var i = start; i < sequence.length; i++) {
      var delimType = sequence[i];
      if (delimType.type === "stack") {
        break;
      }
      var metrics = getMetrics(delim, delimTypeToFont(delimType), "math");
      var heightDepth = metrics.height + metrics.depth;
      if (delimType.type === "small") {
        var newOptions = options.havingBaseStyle(delimType.style);
        heightDepth *= newOptions.sizeMultiplier;
      }
      if (heightDepth > height) {
        return delimType;
      }
    }
    return sequence[sequence.length - 1];
  };
  var makeCustomSizedDelim = function makeCustomSizedDelim2(delim, height, center, options, mode, classes) {
    if (delim === "<" || delim === "\\lt" || delim === "\u27E8") {
      delim = "\\langle";
    } else if (delim === ">" || delim === "\\gt" || delim === "\u27E9") {
      delim = "\\rangle";
    }
    var sequence;
    if (stackNeverDelimiters.has(delim)) {
      sequence = stackNeverDelimiterSequence;
    } else if (stackLargeDelimiters.has(delim)) {
      sequence = stackLargeDelimiterSequence;
    } else {
      sequence = stackAlwaysDelimiterSequence;
    }
    var delimType = traverseSequence(delim, height, sequence, options);
    if (delimType.type === "small") {
      return makeSmallDelim(delim, delimType.style, center, options, mode, classes);
    } else if (delimType.type === "large") {
      return makeLargeDelim(delim, delimType.size, center, options, mode, classes);
    } else {
      return makeStackedDelim(delim, height, center, options, mode, classes);
    }
  };
  var makeLeftRightDelim = function makeLeftRightDelim2(delim, height, depth, options, mode, classes) {
    var axisHeight = options.fontMetrics().axisHeight * options.sizeMultiplier;
    var delimiterFactor = 901;
    var delimiterExtend = 5 / options.fontMetrics().ptPerEm;
    var maxDistFromAxis = Math.max(height - axisHeight, depth + axisHeight);
    var totalHeight = Math.max(
      // In real TeX, calculations are done using integral values which are
      // 65536 per pt, or 655360 per em. So, the division here truncates in
      // TeX but doesn't here, producing different results. If we wanted to
      // exactly match TeX's calculation, we could do
      //   Math.floor(655360 * maxDistFromAxis / 500) *
      //    delimiterFactor / 655360
      // (To see the difference, compare
      //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
      // in TeX and KaTeX)
      maxDistFromAxis / 500 * delimiterFactor,
      2 * maxDistFromAxis - delimiterExtend
    );
    return makeCustomSizedDelim(delim, totalHeight, true, options, mode, classes);
  };
  var delimiterSizes = {
    "\\bigl": {
      mclass: "mopen",
      size: 1
    },
    "\\Bigl": {
      mclass: "mopen",
      size: 2
    },
    "\\biggl": {
      mclass: "mopen",
      size: 3
    },
    "\\Biggl": {
      mclass: "mopen",
      size: 4
    },
    "\\bigr": {
      mclass: "mclose",
      size: 1
    },
    "\\Bigr": {
      mclass: "mclose",
      size: 2
    },
    "\\biggr": {
      mclass: "mclose",
      size: 3
    },
    "\\Biggr": {
      mclass: "mclose",
      size: 4
    },
    "\\bigm": {
      mclass: "mrel",
      size: 1
    },
    "\\Bigm": {
      mclass: "mrel",
      size: 2
    },
    "\\biggm": {
      mclass: "mrel",
      size: 3
    },
    "\\Biggm": {
      mclass: "mrel",
      size: 4
    },
    "\\big": {
      mclass: "mord",
      size: 1
    },
    "\\Big": {
      mclass: "mord",
      size: 2
    },
    "\\bigg": {
      mclass: "mord",
      size: 3
    },
    "\\Bigg": {
      mclass: "mord",
      size: 4
    }
  };
  var delimiters = /* @__PURE__ */ new Set(["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "<", ">", "\\langle", "\u27E8", "\\rangle", "\u27E9", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."]);
  function isMiddleDelimNode(node) {
    return "isMiddle" in node;
  }
  function checkDelimiter(delim, context) {
    var symDelim = checkSymbolNodeType(delim);
    if (symDelim && delimiters.has(symDelim.text)) {
      return symDelim;
    } else if (symDelim) {
      throw new ParseError("Invalid delimiter '" + symDelim.text + "' after '" + context.funcName + "'", delim);
    } else {
      throw new ParseError("Invalid delimiter type '" + delim.type + "'", delim);
    }
  }
  defineFunction({
    type: "delimsizing",
    names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
    props: {
      numArgs: 1,
      argTypes: ["primitive"]
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      return {
        type: "delimsizing",
        mode: context.parser.mode,
        size: delimiterSizes[context.funcName].size,
        mclass: delimiterSizes[context.funcName].mclass,
        delim: delim.text
      };
    },
    htmlBuilder: (group, options) => {
      if (group.delim === ".") {
        return makeSpan([group.mclass]);
      }
      return makeSizedDelim(group.delim, group.size, options, group.mode, [group.mclass]);
    },
    mathmlBuilder: (group) => {
      var children = [];
      if (group.delim !== ".") {
        children.push(makeText(group.delim, group.mode));
      }
      var node = new MathNode("mo", children);
      if (group.mclass === "mopen" || group.mclass === "mclose") {
        node.setAttribute("fence", "true");
      } else {
        node.setAttribute("fence", "false");
      }
      node.setAttribute("stretchy", "true");
      var size = makeEm(sizeToMaxHeight[group.size]);
      node.setAttribute("minsize", size);
      node.setAttribute("maxsize", size);
      return node;
    }
  });
  function assertParsed(group) {
    if (!group.body) {
      throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
    }
  }
  defineFunction({
    type: "leftright-right",
    names: ["\\right"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var color = context.parser.gullet.macros.get("\\current@color");
      if (color && typeof color !== "string") {
        throw new ParseError("\\current@color set to non-string in \\right");
      }
      return {
        type: "leftright-right",
        mode: context.parser.mode,
        delim: checkDelimiter(args[0], context).text,
        color
        // undefined if not set via \color
      };
    }
  });
  defineFunction({
    type: "leftright",
    names: ["\\left"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      var parser = context.parser;
      ++parser.leftrightDepth;
      var body = parser.parseExpression(false);
      --parser.leftrightDepth;
      parser.expect("\\right", false);
      var right = assertNodeType(parser.parseFunction(), "leftright-right");
      return {
        type: "leftright",
        mode: parser.mode,
        body,
        left: delim.text,
        right: right.delim,
        rightColor: right.color
      };
    },
    htmlBuilder: (group, options) => {
      assertParsed(group);
      var inner2 = buildExpression$1(group.body, options, true, ["mopen", "mclose"]);
      var innerHeight = 0;
      var innerDepth = 0;
      var hadMiddle = false;
      for (var i = 0; i < inner2.length; i++) {
        var node = inner2[i];
        if (isMiddleDelimNode(node)) {
          hadMiddle = true;
        } else {
          innerHeight = Math.max(inner2[i].height, innerHeight);
          innerDepth = Math.max(inner2[i].depth, innerDepth);
        }
      }
      innerHeight *= options.sizeMultiplier;
      innerDepth *= options.sizeMultiplier;
      var leftDelim;
      if (group.left === ".") {
        leftDelim = makeNullDelimiter(options, ["mopen"]);
      } else {
        leftDelim = makeLeftRightDelim(group.left, innerHeight, innerDepth, options, group.mode, ["mopen"]);
      }
      inner2.unshift(leftDelim);
      if (hadMiddle) {
        for (var _i = 1; _i < inner2.length; _i++) {
          var middleDelim = inner2[_i];
          if (isMiddleDelimNode(middleDelim)) {
            var isMiddle = middleDelim.isMiddle;
            inner2[_i] = makeLeftRightDelim(isMiddle.delim, innerHeight, innerDepth, isMiddle.options, group.mode, []);
          }
        }
      }
      var rightDelim;
      if (group.right === ".") {
        rightDelim = makeNullDelimiter(options, ["mclose"]);
      } else {
        var colorOptions = group.rightColor ? options.withColor(group.rightColor) : options;
        rightDelim = makeLeftRightDelim(group.right, innerHeight, innerDepth, colorOptions, group.mode, ["mclose"]);
      }
      inner2.push(rightDelim);
      return makeSpan(["minner"], inner2, options);
    },
    mathmlBuilder: (group, options) => {
      assertParsed(group);
      var inner2 = buildExpression2(group.body, options);
      if (group.left !== ".") {
        var leftNode = new MathNode("mo", [makeText(group.left, group.mode)]);
        leftNode.setAttribute("fence", "true");
        inner2.unshift(leftNode);
      }
      if (group.right !== ".") {
        var rightNode = new MathNode("mo", [makeText(group.right, group.mode)]);
        rightNode.setAttribute("fence", "true");
        if (group.rightColor) {
          rightNode.setAttribute("mathcolor", group.rightColor);
        }
        inner2.push(rightNode);
      }
      return makeRow(inner2);
    }
  });
  defineFunction({
    type: "middle",
    names: ["\\middle"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (context, args) => {
      var delim = checkDelimiter(args[0], context);
      if (!context.parser.leftrightDepth) {
        throw new ParseError("\\middle without preceding \\left", delim);
      }
      return {
        type: "middle",
        mode: context.parser.mode,
        delim: delim.text
      };
    },
    htmlBuilder: (group, options) => {
      var middleDelim;
      if (group.delim === ".") {
        middleDelim = makeNullDelimiter(options, []);
      } else {
        middleDelim = makeSizedDelim(group.delim, 1, options, group.mode, []);
        middleDelim.isMiddle = {
          delim: group.delim,
          options
        };
      }
      return middleDelim;
    },
    mathmlBuilder: (group, options) => {
      var textNode = group.delim === "\\vert" || group.delim === "|" ? makeText("|", "text") : makeText(group.delim, group.mode);
      var middleNode = new MathNode("mo", [textNode]);
      middleNode.setAttribute("fence", "true");
      middleNode.setAttribute("lspace", "0.05em");
      middleNode.setAttribute("rspace", "0.05em");
      return middleNode;
    }
  });
  var htmlBuilder$7 = (group, options) => {
    var inner2 = wrapFragment(buildGroup$1(group.body, options), options);
    var label = group.label.slice(1);
    var scale = options.sizeMultiplier;
    var img;
    var imgShift;
    var isSingleChar = isCharacterBox(group.body);
    if (label === "sout") {
      img = makeSpan(["stretchy", "sout"]);
      img.height = options.fontMetrics().defaultRuleThickness / scale;
      imgShift = -0.5 * options.fontMetrics().xHeight;
    } else if (label === "phase") {
      var lineWeight = calculateSize({
        number: 0.6,
        unit: "pt"
      }, options);
      var clearance = calculateSize({
        number: 0.35,
        unit: "ex"
      }, options);
      var newOptions = options.havingBaseSizing();
      scale = scale / newOptions.sizeMultiplier;
      var angleHeight = inner2.height + inner2.depth + lineWeight + clearance;
      inner2.style.paddingLeft = makeEm(angleHeight / 2 + lineWeight);
      var viewBoxHeight = Math.floor(1e3 * angleHeight * scale);
      var path2 = phasePath(viewBoxHeight);
      var svgNode = new SvgNode([new PathNode("phase", path2)], {
        "width": "400em",
        "height": makeEm(viewBoxHeight / 1e3),
        "viewBox": "0 0 400000 " + viewBoxHeight,
        "preserveAspectRatio": "xMinYMin slice"
      });
      img = makeSvgSpan(["hide-tail"], [svgNode], options);
      img.style.height = makeEm(angleHeight);
      imgShift = inner2.depth + lineWeight + clearance;
    } else {
      if (/cancel/.test(label)) {
        if (!isSingleChar) {
          inner2.classes.push("cancel-pad");
        }
      } else if (label === "angl") {
        inner2.classes.push("anglpad");
      } else {
        inner2.classes.push("boxpad");
      }
      var topPad;
      var bottomPad;
      var ruleThickness = 0;
      if (/box/.test(label)) {
        ruleThickness = Math.max(
          options.fontMetrics().fboxrule,
          // default
          options.minRuleThickness
        );
        topPad = options.fontMetrics().fboxsep + (label === "colorbox" ? 0 : ruleThickness);
        bottomPad = topPad;
      } else if (label === "angl") {
        ruleThickness = Math.max(options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
        topPad = 4 * ruleThickness;
        bottomPad = Math.max(0, 0.25 - inner2.depth);
      } else {
        topPad = isSingleChar ? 0.2 : 0;
        bottomPad = topPad;
      }
      img = stretchyEnclose(inner2, label, topPad, bottomPad, options);
      if (/fbox|boxed|fcolorbox/.test(label)) {
        img.style.borderStyle = "solid";
        img.style.borderWidth = makeEm(ruleThickness);
      } else if (label === "angl" && ruleThickness !== 0.049) {
        img.style.borderTopWidth = makeEm(ruleThickness);
        img.style.borderRightWidth = makeEm(ruleThickness);
      }
      imgShift = inner2.depth + bottomPad;
      if (group.backgroundColor) {
        img.style.backgroundColor = group.backgroundColor;
        if (group.borderColor) {
          img.style.borderColor = group.borderColor;
        }
      }
    }
    var vlist;
    if (group.backgroundColor) {
      vlist = makeVList({
        positionType: "individualShift",
        children: [
          // Put the color background behind inner;
          {
            type: "elem",
            elem: img,
            shift: imgShift
          },
          {
            type: "elem",
            elem: inner2,
            shift: 0
          }
        ]
      });
    } else {
      var classes = /cancel|phase/.test(label) ? ["svg-align"] : [];
      vlist = makeVList({
        positionType: "individualShift",
        children: [
          // Write the \cancel stroke on top of inner.
          {
            type: "elem",
            elem: inner2,
            shift: 0
          },
          {
            type: "elem",
            elem: img,
            shift: imgShift,
            wrapperClasses: classes
          }
        ]
      });
    }
    if (/cancel/.test(label)) {
      vlist.height = inner2.height;
      vlist.depth = inner2.depth;
    }
    if (/cancel/.test(label) && !isSingleChar) {
      return makeSpan(["mord", "cancel-lap"], [vlist], options);
    } else {
      return makeSpan(["mord"], [vlist], options);
    }
  };
  var mathmlBuilder$6 = (group, options) => {
    var fboxsep;
    var node = new MathNode(group.label.includes("colorbox") ? "mpadded" : "menclose", [buildGroup2(group.body, options)]);
    switch (group.label) {
      case "\\cancel":
        node.setAttribute("notation", "updiagonalstrike");
        break;
      case "\\bcancel":
        node.setAttribute("notation", "downdiagonalstrike");
        break;
      case "\\phase":
        node.setAttribute("notation", "phasorangle");
        break;
      case "\\sout":
        node.setAttribute("notation", "horizontalstrike");
        break;
      case "\\fbox":
        node.setAttribute("notation", "box");
        break;
      case "\\angl":
        node.setAttribute("notation", "actuarial");
        break;
      case "\\fcolorbox":
      case "\\colorbox":
        fboxsep = options.fontMetrics().fboxsep * options.fontMetrics().ptPerEm;
        node.setAttribute("width", "+" + 2 * fboxsep + "pt");
        node.setAttribute("height", "+" + 2 * fboxsep + "pt");
        node.setAttribute("lspace", fboxsep + "pt");
        node.setAttribute("voffset", fboxsep + "pt");
        if (group.label === "\\fcolorbox") {
          var thk = Math.max(
            options.fontMetrics().fboxrule,
            // default
            options.minRuleThickness
          );
          node.setAttribute("style", "border: " + makeEm(thk) + " solid " + group.borderColor);
        }
        break;
      case "\\xcancel":
        node.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
        break;
    }
    if (group.backgroundColor) {
      node.setAttribute("mathbackground", group.backgroundColor);
    }
    return node;
  };
  defineFunction({
    type: "enclose",
    names: ["\\colorbox"],
    props: {
      numArgs: 2,
      allowedInText: true,
      argTypes: ["color", "hbox"]
    },
    handler(_ref, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref;
      var color = assertNodeType(args[0], "color-token").color;
      var body = args[1];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        backgroundColor: color,
        body
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\fcolorbox"],
    props: {
      numArgs: 3,
      allowedInText: true,
      argTypes: ["color", "color", "hbox"]
    },
    handler(_ref2, args, optArgs) {
      var {
        parser,
        funcName
      } = _ref2;
      var borderColor = assertNodeType(args[0], "color-token").color;
      var backgroundColor = assertNodeType(args[1], "color-token").color;
      var body = args[2];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        backgroundColor,
        borderColor,
        body
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\fbox"],
    props: {
      numArgs: 1,
      argTypes: ["hbox"],
      allowedInText: true
    },
    handler(_ref3, args) {
      var {
        parser
      } = _ref3;
      return {
        type: "enclose",
        mode: parser.mode,
        label: "\\fbox",
        body: args[0]
      };
    }
  });
  defineFunction({
    type: "enclose",
    names: ["\\cancel", "\\bcancel", "\\xcancel", "\\phase"],
    props: {
      numArgs: 1
    },
    handler(_ref4, args) {
      var {
        parser,
        funcName
      } = _ref4;
      var body = args[0];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        body
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\sout"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref5, args) {
      var {
        parser,
        funcName
      } = _ref5;
      if (parser.mode === "math") {
        parser.settings.reportNonstrict("mathVsSout", "LaTeX's \\sout works only in text mode");
      }
      var body = args[0];
      return {
        type: "enclose",
        mode: parser.mode,
        label: funcName,
        body
      };
    },
    htmlBuilder: htmlBuilder$7,
    mathmlBuilder: mathmlBuilder$6
  });
  defineFunction({
    type: "enclose",
    names: ["\\angl"],
    props: {
      numArgs: 1,
      argTypes: ["hbox"],
      allowedInText: false
    },
    handler(_ref6, args) {
      var {
        parser
      } = _ref6;
      return {
        type: "enclose",
        mode: parser.mode,
        label: "\\angl",
        body: args[0]
      };
    }
  });
  var _environments = {};
  function defineEnvironment(_ref) {
    var {
      type,
      names,
      props,
      handler,
      htmlBuilder: htmlBuilder3,
      mathmlBuilder: mathmlBuilder3
    } = _ref;
    var data = {
      type,
      numArgs: props.numArgs || 0,
      allowedInText: false,
      numOptionalArgs: 0,
      handler
    };
    for (var i = 0; i < names.length; ++i) {
      _environments[names[i]] = data;
    }
    if (htmlBuilder3) {
      _htmlGroupBuilders[type] = htmlBuilder3;
    }
    if (mathmlBuilder3) {
      _mathmlGroupBuilders[type] = mathmlBuilder3;
    }
  }
  var _macros = {};
  function defineMacro(name, body) {
    _macros[name] = body;
  }
  var SourceLocation = class _SourceLocation {
    // End offset, zero-based exclusive.
    constructor(lexer, start, end) {
      this.lexer = void 0;
      this.start = void 0;
      this.end = void 0;
      this.lexer = lexer;
      this.start = start;
      this.end = end;
    }
    /**
     * Merges two `SourceLocation`s from location providers, given they are
     * provided in order of appearance.
     * - Returns the first one's location if only the first is provided.
     * - Returns a merged range of the first and the last if both are provided
     *   and their lexers match.
     * - Otherwise, returns null.
     */
    static range(first, second) {
      if (!second) {
        return first && first.loc;
      } else if (!first || !first.loc || !second.loc || first.loc.lexer !== second.loc.lexer) {
        return null;
      } else {
        return new _SourceLocation(first.loc.lexer, first.loc.start, second.loc.end);
      }
    }
  };
  var Token = class _Token {
    // used in \noexpand
    constructor(text4, loc) {
      this.text = void 0;
      this.loc = void 0;
      this.noexpand = void 0;
      this.treatAsRelax = void 0;
      this.text = text4;
      this.loc = loc;
    }
    /**
     * Given a pair of tokens (this and endToken), compute a `Token` encompassing
     * the whole input range enclosed by these two.
     */
    range(endToken, text4) {
      return new _Token(text4, SourceLocation.range(this, endToken));
    }
  };
  function getHLines(parser) {
    var hlineInfo = [];
    parser.consumeSpaces();
    var nxt = parser.fetch().text;
    if (nxt === "\\relax") {
      parser.consume();
      parser.consumeSpaces();
      nxt = parser.fetch().text;
    }
    while (nxt === "\\hline" || nxt === "\\hdashline") {
      parser.consume();
      hlineInfo.push(nxt === "\\hdashline");
      parser.consumeSpaces();
      nxt = parser.fetch().text;
    }
    return hlineInfo;
  }
  var validateAmsEnvironmentContext = (context) => {
    var settings = context.parser.settings;
    if (!settings.displayMode) {
      throw new ParseError("{" + context.envName + "} can be used only in display mode.");
    }
  };
  var gatherEnvironments = /* @__PURE__ */ new Set(["gather", "gather*"]);
  function getAutoTag(name) {
    if (!name.includes("ed")) {
      return !name.includes("*");
    }
  }
  function parseArray(parser, _ref, style) {
    var {
      hskipBeforeAndAfter,
      addJot,
      cols,
      arraystretch,
      colSeparationType,
      autoTag,
      singleRow,
      emptySingleRow,
      maxNumCols,
      leqno
    } = _ref;
    parser.gullet.beginGroup();
    if (!singleRow) {
      parser.gullet.macros.set("\\cr", "\\\\\\relax");
    }
    if (!arraystretch) {
      var stretch = parser.gullet.expandMacroAsText("\\arraystretch");
      if (stretch == null) {
        arraystretch = 1;
      } else {
        arraystretch = parseFloat(stretch);
        if (!arraystretch || arraystretch < 0) {
          throw new ParseError("Invalid \\arraystretch: " + stretch);
        }
      }
    }
    parser.gullet.beginGroup();
    var row = [];
    var body = [row];
    var rowGaps = [];
    var hLinesBeforeRow = [];
    var tags = autoTag != null ? [] : void 0;
    function beginRow() {
      if (autoTag) {
        parser.gullet.macros.set("\\@eqnsw", "1", true);
      }
    }
    function endRow() {
      if (tags) {
        if (parser.gullet.macros.get("\\df@tag")) {
          tags.push(parser.subparse([new Token("\\df@tag")]));
          parser.gullet.macros.set("\\df@tag", void 0, true);
        } else {
          tags.push(Boolean(autoTag) && parser.gullet.macros.get("\\@eqnsw") === "1");
        }
      }
    }
    beginRow();
    hLinesBeforeRow.push(getHLines(parser));
    while (true) {
      var cellBody = parser.parseExpression(false, singleRow ? "\\end" : "\\\\");
      parser.gullet.endGroup();
      parser.gullet.beginGroup();
      var cell = {
        type: "ordgroup",
        mode: parser.mode,
        body: cellBody
      };
      if (style) {
        cell = {
          type: "styling",
          mode: parser.mode,
          style,
          resetFont: true,
          body: [cell]
        };
      }
      row.push(cell);
      var next = parser.fetch().text;
      if (next === "&") {
        if (maxNumCols && row.length === maxNumCols) {
          if (singleRow || colSeparationType) {
            throw new ParseError("Too many tab characters: &", parser.nextToken);
          } else {
            parser.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
          }
        }
        parser.consume();
      } else if (next === "\\end") {
        endRow();
        if (row.length === 1 && cell.type === "styling" && cell.body.length === 1 && cell.body[0].type === "ordgroup" && cell.body[0].body.length === 0 && (body.length > 1 || !emptySingleRow)) {
          body.pop();
        }
        if (hLinesBeforeRow.length < body.length + 1) {
          hLinesBeforeRow.push([]);
        }
        break;
      } else if (next === "\\\\") {
        parser.consume();
        var size = void 0;
        if (parser.gullet.future().text !== " ") {
          size = parser.parseSizeGroup(true);
        }
        rowGaps.push(size ? size.value : null);
        endRow();
        hLinesBeforeRow.push(getHLines(parser));
        row = [];
        body.push(row);
        beginRow();
      } else {
        throw new ParseError("Expected & or \\\\ or \\cr or \\end", parser.nextToken);
      }
    }
    parser.gullet.endGroup();
    parser.gullet.endGroup();
    return {
      type: "array",
      mode: parser.mode,
      addJot,
      arraystretch,
      body,
      cols,
      rowGaps,
      hskipBeforeAndAfter,
      hLinesBeforeRow,
      colSeparationType,
      tags,
      leqno
    };
  }
  function dCellStyle(envName) {
    if (envName.slice(0, 1) === "d") {
      return "display";
    } else {
      return "text";
    }
  }
  var htmlBuilder$6 = function htmlBuilder(group, options) {
    var r;
    var c2;
    var nr = group.body.length;
    var hLinesBeforeRow = group.hLinesBeforeRow;
    var nc = 0;
    var body = new Array(nr);
    var hlines = [];
    var ruleThickness = Math.max(
      // From LaTeX \showthe\arrayrulewidth. Equals 0.04 em.
      options.fontMetrics().arrayRuleWidth,
      options.minRuleThickness
    );
    var pt2 = 1 / options.fontMetrics().ptPerEm;
    var arraycolsep = 5 * pt2;
    if (group.colSeparationType && group.colSeparationType === "small") {
      var localMultiplier = options.havingStyle(Style$1.SCRIPT).sizeMultiplier;
      arraycolsep = 0.2778 * (localMultiplier / options.sizeMultiplier);
    }
    var baselineskip = group.colSeparationType === "CD" ? calculateSize({
      number: 3,
      unit: "ex"
    }, options) : 12 * pt2;
    var jot = 3 * pt2;
    var arrayskip = group.arraystretch * baselineskip;
    var arstrutHeight = 0.7 * arrayskip;
    var arstrutDepth = 0.3 * arrayskip;
    var totalHeight = 0;
    function setHLinePos(hlinesInGap) {
      for (var i = 0; i < hlinesInGap.length; ++i) {
        if (i > 0) {
          totalHeight += 0.25;
        }
        hlines.push({
          pos: totalHeight,
          isDashed: hlinesInGap[i]
        });
      }
    }
    setHLinePos(hLinesBeforeRow[0]);
    for (r = 0; r < group.body.length; ++r) {
      var inrow = group.body[r];
      var height = arstrutHeight;
      var depth = arstrutDepth;
      if (nc < inrow.length) {
        nc = inrow.length;
      }
      var outrow = {
        cells: new Array(inrow.length),
        height: 0,
        depth: 0,
        pos: 0
      };
      for (c2 = 0; c2 < inrow.length; ++c2) {
        var elt = buildGroup$1(inrow[c2], options);
        if (depth < elt.depth) {
          depth = elt.depth;
        }
        if (height < elt.height) {
          height = elt.height;
        }
        outrow.cells[c2] = elt;
      }
      var rowGap = group.rowGaps[r];
      var gap = 0;
      if (rowGap) {
        gap = calculateSize(rowGap, options);
        if (gap > 0) {
          gap += arstrutDepth;
          if (depth < gap) {
            depth = gap;
          }
          gap = 0;
        }
      }
      if (group.addJot && r < group.body.length - 1) {
        depth += jot;
      }
      outrow.height = height;
      outrow.depth = depth;
      totalHeight += height;
      outrow.pos = totalHeight;
      totalHeight += depth + gap;
      body[r] = outrow;
      setHLinePos(hLinesBeforeRow[r + 1]);
    }
    var offset = totalHeight / 2 + options.fontMetrics().axisHeight;
    var colDescriptions = group.cols || [];
    var cols = [];
    var colSep;
    var colDescrNum;
    var tagSpans = [];
    if (group.tags && group.tags.some((tag2) => tag2)) {
      for (r = 0; r < nr; ++r) {
        var rw = body[r];
        var shift = rw.pos - offset;
        var tag = group.tags[r];
        var tagSpan = void 0;
        if (tag === true) {
          tagSpan = makeSpan(["eqn-num"], [], options);
        } else if (tag === false) {
          tagSpan = makeSpan([], [], options);
        } else {
          tagSpan = makeSpan([], buildExpression$1(tag, options, true), options);
        }
        tagSpan.depth = rw.depth;
        tagSpan.height = rw.height;
        tagSpans.push({
          type: "elem",
          elem: tagSpan,
          shift
        });
      }
    }
    for (
      c2 = 0, colDescrNum = 0;
      // Continue while either there are more columns or more column
      // descriptions, so trailing separators don't get lost.
      c2 < nc || colDescrNum < colDescriptions.length;
      ++c2, ++colDescrNum
    ) {
      var _colDescr3;
      var colDescr = colDescriptions[colDescrNum];
      var firstSeparator = true;
      while (((_colDescr = colDescr) == null ? void 0 : _colDescr.type) === "separator") {
        var _colDescr;
        if (!firstSeparator) {
          colSep = makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(options.fontMetrics().doubleRuleSep);
          cols.push(colSep);
        }
        if (colDescr.separator === "|" || colDescr.separator === ":") {
          var lineType = colDescr.separator === "|" ? "solid" : "dashed";
          var separator = makeSpan(["vertical-separator"], [], options);
          separator.style.height = makeEm(totalHeight);
          separator.style.borderRightWidth = makeEm(ruleThickness);
          separator.style.borderRightStyle = lineType;
          separator.style.margin = "0 " + makeEm(-ruleThickness / 2);
          var _shift = totalHeight - offset;
          if (_shift) {
            separator.style.verticalAlign = makeEm(-_shift);
          }
          cols.push(separator);
        } else {
          throw new ParseError("Invalid separator type: " + colDescr.separator);
        }
        colDescrNum++;
        colDescr = colDescriptions[colDescrNum];
        firstSeparator = false;
      }
      if (c2 >= nc) {
        continue;
      }
      var sepwidth = void 0;
      if (c2 > 0 || group.hskipBeforeAndAfter) {
        var _colDescr$pregap, _colDescr2;
        sepwidth = (_colDescr$pregap = (_colDescr2 = colDescr) == null ? void 0 : _colDescr2.pregap) != null ? _colDescr$pregap : arraycolsep;
        if (sepwidth !== 0) {
          colSep = makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(sepwidth);
          cols.push(colSep);
        }
      }
      var colElems = [];
      for (r = 0; r < nr; ++r) {
        var row = body[r];
        var elem = row.cells[c2];
        if (!elem) {
          continue;
        }
        var _shift2 = row.pos - offset;
        elem.depth = row.depth;
        elem.height = row.height;
        colElems.push({
          type: "elem",
          elem,
          shift: _shift2
        });
      }
      var colVList = makeVList({
        positionType: "individualShift",
        children: colElems
      });
      var colSpan = makeSpan(["col-align-" + (((_colDescr3 = colDescr) == null ? void 0 : _colDescr3.align) || "c")], [colVList]);
      cols.push(colSpan);
      if (c2 < nc - 1 || group.hskipBeforeAndAfter) {
        var _colDescr$postgap, _colDescr4;
        sepwidth = (_colDescr$postgap = (_colDescr4 = colDescr) == null ? void 0 : _colDescr4.postgap) != null ? _colDescr$postgap : arraycolsep;
        if (sepwidth !== 0) {
          colSep = makeSpan(["arraycolsep"], []);
          colSep.style.width = makeEm(sepwidth);
          cols.push(colSep);
        }
      }
    }
    var tableBody = makeSpan(["mtable"], cols);
    if (hlines.length > 0) {
      var line = makeLineSpan("hline", options, ruleThickness);
      var dashes = makeLineSpan("hdashline", options, ruleThickness);
      var vListElems = [{
        type: "elem",
        elem: tableBody,
        shift: 0
      }];
      while (hlines.length > 0) {
        var hline = hlines.pop();
        var lineShift = hline.pos - offset;
        if (hline.isDashed) {
          vListElems.push({
            type: "elem",
            elem: dashes,
            shift: lineShift
          });
        } else {
          vListElems.push({
            type: "elem",
            elem: line,
            shift: lineShift
          });
        }
      }
      tableBody = makeVList({
        positionType: "individualShift",
        children: vListElems
      });
    }
    if (tagSpans.length === 0) {
      return makeSpan(["mord"], [tableBody], options);
    } else {
      var eqnNumCol = makeVList({
        positionType: "individualShift",
        children: tagSpans
      });
      var tagCol = makeSpan(["tag"], [eqnNumCol], options);
      return makeFragment([tableBody, tagCol]);
    }
  };
  var alignMap = {
    c: "center ",
    l: "left ",
    r: "right "
  };
  var mathmlBuilder$5 = function mathmlBuilder(group, options) {
    var tbl = [];
    var glue = new MathNode("mtd", [], ["mtr-glue"]);
    var tag = new MathNode("mtd", [], ["mml-eqn-num"]);
    for (var i = 0; i < group.body.length; i++) {
      var rw = group.body[i];
      var row = [];
      for (var j3 = 0; j3 < rw.length; j3++) {
        row.push(new MathNode("mtd", [buildGroup2(rw[j3], options)]));
      }
      if (group.tags && group.tags[i]) {
        row.unshift(glue);
        row.push(glue);
        if (group.leqno) {
          row.unshift(tag);
        } else {
          row.push(tag);
        }
      }
      tbl.push(new MathNode("mtr", row));
    }
    var table = new MathNode("mtable", tbl);
    var gap = group.arraystretch === 0.5 ? 0.1 : 0.16 + group.arraystretch - 1 + (group.addJot ? 0.09 : 0);
    table.setAttribute("rowspacing", makeEm(gap));
    var menclose = "";
    var align = "";
    if (group.cols && group.cols.length > 0) {
      var cols = group.cols;
      var columnLines = "";
      var prevTypeWasAlign = false;
      var iStart = 0;
      var iEnd = cols.length;
      if (cols[0].type === "separator") {
        menclose += "top ";
        iStart = 1;
      }
      if (cols[cols.length - 1].type === "separator") {
        menclose += "bottom ";
        iEnd -= 1;
      }
      for (var _i = iStart; _i < iEnd; _i++) {
        var col = cols[_i];
        if (col.type === "align") {
          align += alignMap[col.align];
          if (prevTypeWasAlign) {
            columnLines += "none ";
          }
          prevTypeWasAlign = true;
        } else if (col.type === "separator") {
          if (prevTypeWasAlign) {
            columnLines += col.separator === "|" ? "solid " : "dashed ";
            prevTypeWasAlign = false;
          }
        }
      }
      table.setAttribute("columnalign", align.trim());
      if (/[sd]/.test(columnLines)) {
        table.setAttribute("columnlines", columnLines.trim());
      }
    }
    if (group.colSeparationType === "align") {
      var _cols = group.cols || [];
      var spacing2 = "";
      for (var _i2 = 1; _i2 < _cols.length; _i2++) {
        spacing2 += _i2 % 2 ? "0em " : "1em ";
      }
      table.setAttribute("columnspacing", spacing2.trim());
    } else if (group.colSeparationType === "alignat" || group.colSeparationType === "gather") {
      table.setAttribute("columnspacing", "0em");
    } else if (group.colSeparationType === "small") {
      table.setAttribute("columnspacing", "0.2778em");
    } else if (group.colSeparationType === "CD") {
      table.setAttribute("columnspacing", "0.5em");
    } else {
      table.setAttribute("columnspacing", "1em");
    }
    var rowLines = "";
    var hlines = group.hLinesBeforeRow;
    menclose += hlines[0].length > 0 ? "left " : "";
    menclose += hlines[hlines.length - 1].length > 0 ? "right " : "";
    for (var _i3 = 1; _i3 < hlines.length - 1; _i3++) {
      rowLines += hlines[_i3].length === 0 ? "none " : hlines[_i3][0] ? "dashed " : "solid ";
    }
    if (/[sd]/.test(rowLines)) {
      table.setAttribute("rowlines", rowLines.trim());
    }
    if (menclose !== "") {
      table = new MathNode("menclose", [table]);
      table.setAttribute("notation", menclose.trim());
    }
    if (group.arraystretch && group.arraystretch < 1) {
      table = new MathNode("mstyle", [table]);
      table.setAttribute("scriptlevel", "1");
    }
    return table;
  };
  var alignedHandler = function alignedHandler2(context, args) {
    if (!context.envName.includes("ed")) {
      validateAmsEnvironmentContext(context);
    }
    var cols = [];
    var separationType = context.envName.includes("at") ? "alignat" : "align";
    var isSplit = context.envName === "split";
    var res = parseArray(context.parser, {
      cols,
      addJot: true,
      autoTag: isSplit ? void 0 : getAutoTag(context.envName),
      emptySingleRow: true,
      colSeparationType: separationType,
      maxNumCols: isSplit ? 2 : void 0,
      leqno: context.parser.settings.leqno
    }, "display");
    var numMaths = 0;
    var numCols = 0;
    var emptyGroup = {
      type: "ordgroup",
      mode: context.mode,
      body: []
    };
    if (args[0] && args[0].type === "ordgroup") {
      var arg0 = "";
      for (var i = 0; i < args[0].body.length; i++) {
        var textord2 = assertNodeType(args[0].body[i], "textord");
        arg0 += textord2.text;
      }
      numMaths = Number(arg0);
      numCols = numMaths * 2;
    }
    var isAligned = !numCols;
    res.body.forEach(function(row) {
      for (var _i4 = 1; _i4 < row.length; _i4 += 2) {
        var styling = assertNodeType(row[_i4], "styling");
        var ordgroup = assertNodeType(styling.body[0], "ordgroup");
        ordgroup.body.unshift(emptyGroup);
      }
      if (!isAligned) {
        var curMaths = row.length / 2;
        if (numMaths < curMaths) {
          throw new ParseError("Too many math in a row: " + ("expected " + numMaths + ", but got " + curMaths), row[0]);
        }
      } else if (numCols < row.length) {
        numCols = row.length;
      }
    });
    for (var _i5 = 0; _i5 < numCols; ++_i5) {
      var align = "r";
      var pregap = 0;
      if (_i5 % 2 === 1) {
        align = "l";
      } else if (_i5 > 0 && isAligned) {
        pregap = 1;
      }
      cols[_i5] = {
        type: "align",
        align,
        pregap,
        postgap: 0
      };
    }
    res.colSeparationType = isAligned ? "align" : "alignat";
    return res;
  };
  defineEnvironment({
    type: "array",
    names: ["array", "darray"],
    props: {
      numArgs: 1
    },
    handler(context, args) {
      var symNode = checkSymbolNodeType(args[0]);
      var colalign = symNode ? [args[0]] : assertNodeType(args[0], "ordgroup").body;
      var cols = colalign.map(function(nde) {
        var node = assertSymbolNodeType(nde);
        var ca = node.text;
        if ("lcr".includes(ca)) {
          return {
            type: "align",
            align: ca
          };
        } else if (ca === "|") {
          return {
            type: "separator",
            separator: "|"
          };
        } else if (ca === ":") {
          return {
            type: "separator",
            separator: ":"
          };
        }
        throw new ParseError("Unknown column alignment: " + ca, nde);
      });
      var res = {
        cols,
        hskipBeforeAndAfter: true,
        // \@preamble in lttab.dtx
        maxNumCols: cols.length
      };
      return parseArray(context.parser, res, dCellStyle(context.envName));
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var delimiters2 = {
        "matrix": null,
        "pmatrix": ["(", ")"],
        "bmatrix": ["[", "]"],
        "Bmatrix": ["\\{", "\\}"],
        "vmatrix": ["|", "|"],
        "Vmatrix": ["\\Vert", "\\Vert"]
      }[context.envName.replace("*", "")];
      var colAlign = "c";
      var payload = {
        hskipBeforeAndAfter: false,
        cols: [{
          type: "align",
          align: colAlign
        }]
      };
      if (context.envName.charAt(context.envName.length - 1) === "*") {
        var parser = context.parser;
        parser.consumeSpaces();
        if (parser.fetch().text === "[") {
          parser.consume();
          parser.consumeSpaces();
          colAlign = parser.fetch().text;
          if (!"lcr".includes(colAlign)) {
            throw new ParseError("Expected l or c or r", parser.nextToken);
          }
          parser.consume();
          parser.consumeSpaces();
          parser.expect("]");
          parser.consume();
          payload.cols = [{
            type: "align",
            align: colAlign
          }];
        }
      }
      var res = parseArray(context.parser, payload, dCellStyle(context.envName));
      var numCols = Math.max(0, ...res.body.map((row) => row.length));
      res.cols = new Array(numCols).fill({
        type: "align",
        align: colAlign
      });
      return delimiters2 ? {
        type: "leftright",
        mode: context.mode,
        body: [res],
        left: delimiters2[0],
        right: delimiters2[1],
        rightColor: void 0
        // \right uninfluenced by \color in array
      } : res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["smallmatrix"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var payload = {
        arraystretch: 0.5
      };
      var res = parseArray(context.parser, payload, "script");
      res.colSeparationType = "small";
      return res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["subarray"],
    props: {
      numArgs: 1
    },
    handler(context, args) {
      var symNode = checkSymbolNodeType(args[0]);
      var colalign = symNode ? [args[0]] : assertNodeType(args[0], "ordgroup").body;
      var cols = colalign.map(function(nde) {
        var node = assertSymbolNodeType(nde);
        var ca = node.text;
        if ("lc".includes(ca)) {
          return {
            type: "align",
            align: ca
          };
        }
        throw new ParseError("Unknown column alignment: " + ca, nde);
      });
      if (cols.length > 1) {
        throw new ParseError("{subarray} can contain only one column");
      }
      var payload = {
        cols,
        hskipBeforeAndAfter: false,
        arraystretch: 0.5
      };
      var res = parseArray(context.parser, payload, "script");
      if (res.body.length > 0 && res.body[0].length > 1) {
        throw new ParseError("{subarray} can contain only one column");
      }
      return res;
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["cases", "dcases", "rcases", "drcases"],
    props: {
      numArgs: 0
    },
    handler(context) {
      var payload = {
        arraystretch: 1.2,
        cols: [{
          type: "align",
          align: "l",
          pregap: 0,
          // TODO(kevinb) get the current style.
          // For now we use the metrics for TEXT style which is what we were
          // doing before.  Before attempting to get the current style we
          // should look at TeX's behavior especially for \over and matrices.
          postgap: 1
          /* 1em quad */
        }, {
          type: "align",
          align: "l",
          pregap: 0,
          postgap: 0
        }]
      };
      var res = parseArray(context.parser, payload, dCellStyle(context.envName));
      return {
        type: "leftright",
        mode: context.mode,
        body: [res],
        left: context.envName.includes("r") ? "." : "\\{",
        right: context.envName.includes("r") ? "\\}" : ".",
        rightColor: void 0
      };
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["align", "align*", "aligned", "split"],
    props: {
      numArgs: 0
    },
    handler: alignedHandler,
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["gathered", "gather", "gather*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      if (gatherEnvironments.has(context.envName)) {
        validateAmsEnvironmentContext(context);
      }
      var res = {
        cols: [{
          type: "align",
          align: "c"
        }],
        addJot: true,
        colSeparationType: "gather",
        autoTag: getAutoTag(context.envName),
        emptySingleRow: true,
        leqno: context.parser.settings.leqno
      };
      return parseArray(context.parser, res, "display");
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["alignat", "alignat*", "alignedat"],
    props: {
      numArgs: 1
    },
    handler: alignedHandler,
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["equation", "equation*"],
    props: {
      numArgs: 0
    },
    handler(context) {
      validateAmsEnvironmentContext(context);
      var res = {
        autoTag: getAutoTag(context.envName),
        emptySingleRow: true,
        singleRow: true,
        maxNumCols: 1,
        leqno: context.parser.settings.leqno
      };
      return parseArray(context.parser, res, "display");
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineEnvironment({
    type: "array",
    names: ["CD"],
    props: {
      numArgs: 0
    },
    handler(context) {
      validateAmsEnvironmentContext(context);
      return parseCD(context.parser);
    },
    htmlBuilder: htmlBuilder$6,
    mathmlBuilder: mathmlBuilder$5
  });
  defineMacro("\\nonumber", "\\gdef\\@eqnsw{0}");
  defineMacro("\\notag", "\\nonumber");
  defineFunction({
    type: "text",
    // Doesn't matter what this is.
    names: ["\\hline", "\\hdashline"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: true
    },
    handler(context, args) {
      throw new ParseError(context.funcName + " valid only within array environment");
    }
  });
  var environments = _environments;
  defineFunction({
    type: "environment",
    names: ["\\begin", "\\end"],
    props: {
      numArgs: 1,
      argTypes: ["text"]
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var nameGroup = args[0];
      if (nameGroup.type !== "ordgroup") {
        throw new ParseError("Invalid environment name", nameGroup);
      }
      var envName = "";
      for (var i = 0; i < nameGroup.body.length; ++i) {
        envName += assertNodeType(nameGroup.body[i], "textord").text;
      }
      if (funcName === "\\begin") {
        if (!environments.hasOwnProperty(envName)) {
          throw new ParseError("No such environment: " + envName, nameGroup);
        }
        var env = environments[envName];
        var {
          args: _args,
          optArgs
        } = parser.parseArguments("\\begin{" + envName + "}", env);
        var context = {
          mode: parser.mode,
          envName,
          parser
        };
        var result = env.handler(context, _args, optArgs);
        parser.expect("\\end", false);
        var endNameToken = parser.nextToken;
        var end = assertNodeType(parser.parseFunction(), "environment");
        if (end.name !== envName) {
          throw new ParseError("Mismatch: \\begin{" + envName + "} matched by \\end{" + end.name + "}", endNameToken);
        }
        return result;
      }
      return {
        type: "environment",
        mode: parser.mode,
        name: envName,
        nameGroup
      };
    }
  });
  var htmlBuilder$5 = (group, options) => {
    var font = group.font;
    var newOptions = options.withFont(font);
    return buildGroup$1(group.body, newOptions);
  };
  var mathmlBuilder$4 = (group, options) => {
    var font = group.font;
    var newOptions = options.withFont(font);
    return buildGroup2(group.body, newOptions);
  };
  var fontAliases = {
    "\\Bbb": "\\mathbb",
    "\\bold": "\\mathbf",
    "\\frak": "\\mathfrak"
  };
  defineFunction({
    type: "font",
    names: [
      // styles, except \boldsymbol defined below
      "\\mathrm",
      "\\mathit",
      "\\mathbf",
      "\\mathnormal",
      "\\mathsfit",
      // families
      "\\mathbb",
      "\\mathcal",
      "\\mathfrak",
      "\\mathscr",
      "\\mathsf",
      "\\mathtt",
      // aliases, except \bm defined below
      "\\Bbb",
      "\\bold",
      "\\frak"
    ],
    props: {
      numArgs: 1,
      allowedInArgument: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body = normalizeArgument(args[0]);
      var func = funcName;
      if (func in fontAliases) {
        func = fontAliases[func];
      }
      return {
        type: "font",
        mode: parser.mode,
        font: func.slice(1),
        body
      };
    },
    htmlBuilder: htmlBuilder$5,
    mathmlBuilder: mathmlBuilder$4
  });
  defineFunction({
    type: "mclass",
    names: ["\\boldsymbol", "\\bm"],
    props: {
      numArgs: 1
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body = args[0];
      return {
        type: "mclass",
        mode: parser.mode,
        mclass: binrelClass(body),
        body: [{
          type: "font",
          mode: parser.mode,
          font: "boldsymbol",
          body
        }],
        isCharacterBox: isCharacterBox(body)
      };
    }
  });
  defineFunction({
    type: "font",
    names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler: (_ref3, args) => {
      var {
        parser,
        funcName,
        breakOnTokenText
      } = _ref3;
      var {
        mode
      } = parser;
      var body = parser.parseExpression(true, breakOnTokenText);
      return {
        type: "font",
        mode,
        font: "math" + funcName.slice(1),
        body: {
          type: "ordgroup",
          mode: parser.mode,
          body
        }
      };
    },
    htmlBuilder: htmlBuilder$5,
    mathmlBuilder: mathmlBuilder$4
  });
  var htmlBuilder$4 = (group, options) => {
    var style = options.style;
    var nstyle = style.fracNum();
    var dstyle = style.fracDen();
    var newOptions;
    newOptions = options.havingStyle(nstyle);
    var numerm = buildGroup$1(group.numer, newOptions, options);
    if (group.continued) {
      var hStrut = 8.5 / options.fontMetrics().ptPerEm;
      var dStrut = 3.5 / options.fontMetrics().ptPerEm;
      numerm.height = numerm.height < hStrut ? hStrut : numerm.height;
      numerm.depth = numerm.depth < dStrut ? dStrut : numerm.depth;
    }
    newOptions = options.havingStyle(dstyle);
    var denomm = buildGroup$1(group.denom, newOptions, options);
    var rule;
    var ruleWidth;
    var ruleSpacing;
    if (group.hasBarLine) {
      if (group.barSize) {
        ruleWidth = calculateSize(group.barSize, options);
        rule = makeLineSpan("frac-line", options, ruleWidth);
      } else {
        rule = makeLineSpan("frac-line", options);
      }
      ruleWidth = rule.height;
      ruleSpacing = rule.height;
    } else {
      rule = null;
      ruleWidth = 0;
      ruleSpacing = options.fontMetrics().defaultRuleThickness;
    }
    var numShift;
    var clearance;
    var denomShift;
    if (style.size === Style$1.DISPLAY.size) {
      numShift = options.fontMetrics().num1;
      if (ruleWidth > 0) {
        clearance = 3 * ruleSpacing;
      } else {
        clearance = 7 * ruleSpacing;
      }
      denomShift = options.fontMetrics().denom1;
    } else {
      if (ruleWidth > 0) {
        numShift = options.fontMetrics().num2;
        clearance = ruleSpacing;
      } else {
        numShift = options.fontMetrics().num3;
        clearance = 3 * ruleSpacing;
      }
      denomShift = options.fontMetrics().denom2;
    }
    var frac;
    if (!rule) {
      var candidateClearance = numShift - numerm.depth - (denomm.height - denomShift);
      if (candidateClearance < clearance) {
        numShift += 0.5 * (clearance - candidateClearance);
        denomShift += 0.5 * (clearance - candidateClearance);
      }
      frac = makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: denomm,
          shift: denomShift
        }, {
          type: "elem",
          elem: numerm,
          shift: -numShift
        }]
      });
    } else {
      var axisHeight = options.fontMetrics().axisHeight;
      if (numShift - numerm.depth - (axisHeight + 0.5 * ruleWidth) < clearance) {
        numShift += clearance - (numShift - numerm.depth - (axisHeight + 0.5 * ruleWidth));
      }
      if (axisHeight - 0.5 * ruleWidth - (denomm.height - denomShift) < clearance) {
        denomShift += clearance - (axisHeight - 0.5 * ruleWidth - (denomm.height - denomShift));
      }
      var midShift = -(axisHeight - 0.5 * ruleWidth);
      frac = makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: denomm,
          shift: denomShift
        }, {
          type: "elem",
          elem: rule,
          shift: midShift
        }, {
          type: "elem",
          elem: numerm,
          shift: -numShift
        }]
      });
    }
    newOptions = options.havingStyle(style);
    frac.height *= newOptions.sizeMultiplier / options.sizeMultiplier;
    frac.depth *= newOptions.sizeMultiplier / options.sizeMultiplier;
    var delimSize;
    if (style.size === Style$1.DISPLAY.size) {
      delimSize = options.fontMetrics().delim1;
    } else if (style.size === Style$1.SCRIPTSCRIPT.size) {
      delimSize = options.havingStyle(Style$1.SCRIPT).fontMetrics().delim2;
    } else {
      delimSize = options.fontMetrics().delim2;
    }
    var leftDelim;
    var rightDelim;
    if (group.leftDelim == null) {
      leftDelim = makeNullDelimiter(options, ["mopen"]);
    } else {
      leftDelim = makeCustomSizedDelim(group.leftDelim, delimSize, true, options.havingStyle(style), group.mode, ["mopen"]);
    }
    if (group.continued) {
      rightDelim = makeSpan([]);
    } else if (group.rightDelim == null) {
      rightDelim = makeNullDelimiter(options, ["mclose"]);
    } else {
      rightDelim = makeCustomSizedDelim(group.rightDelim, delimSize, true, options.havingStyle(style), group.mode, ["mclose"]);
    }
    return makeSpan(["mord"].concat(newOptions.sizingClasses(options)), [leftDelim, makeSpan(["mfrac"], [frac]), rightDelim], options);
  };
  var mathmlBuilder$3 = (group, options) => {
    var node = new MathNode("mfrac", [buildGroup2(group.numer, options), buildGroup2(group.denom, options)]);
    if (!group.hasBarLine) {
      node.setAttribute("linethickness", "0px");
    } else if (group.barSize) {
      var ruleWidth = calculateSize(group.barSize, options);
      node.setAttribute("linethickness", makeEm(ruleWidth));
    }
    if (group.leftDelim != null || group.rightDelim != null) {
      var withDelims = [];
      if (group.leftDelim != null) {
        var leftOp = new MathNode("mo", [new TextNode(group.leftDelim.replace("\\", ""))]);
        leftOp.setAttribute("fence", "true");
        withDelims.push(leftOp);
      }
      withDelims.push(node);
      if (group.rightDelim != null) {
        var rightOp = new MathNode("mo", [new TextNode(group.rightDelim.replace("\\", ""))]);
        rightOp.setAttribute("fence", "true");
        withDelims.push(rightOp);
      }
      return makeRow(withDelims);
    }
    return node;
  };
  var wrapWithStyle = (frac, style) => {
    if (!style) {
      return frac;
    }
    var wrapper = {
      type: "styling",
      mode: frac.mode,
      style,
      body: [frac]
    };
    return wrapper;
  };
  defineFunction({
    type: "genfrac",
    names: [
      "\\cfrac",
      "\\dfrac",
      "\\frac",
      "\\tfrac",
      "\\dbinom",
      "\\binom",
      "\\tbinom",
      "\\\\atopfrac",
      // can’t be entered directly
      "\\\\bracefrac",
      "\\\\brackfrac"
      // ditto
    ],
    props: {
      numArgs: 2,
      allowedInArgument: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var numer = args[0];
      var denom = args[1];
      var hasBarLine;
      var leftDelim = null;
      var rightDelim = null;
      switch (funcName) {
        case "\\cfrac":
        case "\\dfrac":
        case "\\frac":
        case "\\tfrac":
          hasBarLine = true;
          break;
        case "\\\\atopfrac":
          hasBarLine = false;
          break;
        case "\\dbinom":
        case "\\binom":
        case "\\tbinom":
          hasBarLine = false;
          leftDelim = "(";
          rightDelim = ")";
          break;
        case "\\\\bracefrac":
          hasBarLine = false;
          leftDelim = "\\{";
          rightDelim = "\\}";
          break;
        case "\\\\brackfrac":
          hasBarLine = false;
          leftDelim = "[";
          rightDelim = "]";
          break;
        default:
          throw new Error("Unrecognized genfrac command");
      }
      var continued = funcName === "\\cfrac";
      var style = null;
      if (continued || funcName.startsWith("\\d")) {
        style = "display";
      } else if (funcName.startsWith("\\t")) {
        style = "text";
      }
      return wrapWithStyle({
        type: "genfrac",
        mode: parser.mode,
        numer,
        denom,
        continued,
        hasBarLine,
        leftDelim,
        rightDelim,
        barSize: null
      }, style);
    },
    htmlBuilder: htmlBuilder$4,
    mathmlBuilder: mathmlBuilder$3
  });
  defineFunction({
    type: "infix",
    names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
    props: {
      numArgs: 0,
      infix: true
    },
    handler(_ref2) {
      var {
        parser,
        funcName,
        token
      } = _ref2;
      var replaceWith;
      switch (funcName) {
        case "\\over":
          replaceWith = "\\frac";
          break;
        case "\\choose":
          replaceWith = "\\binom";
          break;
        case "\\atop":
          replaceWith = "\\\\atopfrac";
          break;
        case "\\brace":
          replaceWith = "\\\\bracefrac";
          break;
        case "\\brack":
          replaceWith = "\\\\brackfrac";
          break;
        default:
          throw new Error("Unrecognized infix genfrac command");
      }
      return {
        type: "infix",
        mode: parser.mode,
        replaceWith,
        token
      };
    }
  });
  var stylArray = ["display", "text", "script", "scriptscript"];
  var delimFromValue = function delimFromValue2(delimString) {
    var delim = null;
    if (delimString.length > 0) {
      delim = delimString;
      delim = delim === "." ? null : delim;
    }
    return delim;
  };
  defineFunction({
    type: "genfrac",
    names: ["\\genfrac"],
    props: {
      numArgs: 6,
      allowedInArgument: true,
      argTypes: ["math", "math", "size", "text", "math", "math"]
    },
    handler(_ref3, args) {
      var {
        parser
      } = _ref3;
      var numer = args[4];
      var denom = args[5];
      var leftNode = normalizeArgument(args[0]);
      var leftDelim = leftNode.type === "atom" && leftNode.family === "open" ? delimFromValue(leftNode.text) : null;
      var rightNode = normalizeArgument(args[1]);
      var rightDelim = rightNode.type === "atom" && rightNode.family === "close" ? delimFromValue(rightNode.text) : null;
      var barNode = assertNodeType(args[2], "size");
      var hasBarLine;
      var barSize = null;
      if (barNode.isBlank) {
        hasBarLine = true;
      } else {
        barSize = barNode.value;
        hasBarLine = barSize.number > 0;
      }
      var size = null;
      var styl = args[3];
      if (styl.type === "ordgroup") {
        if (styl.body.length > 0) {
          var textOrd = assertNodeType(styl.body[0], "textord");
          size = stylArray[Number(textOrd.text)];
        }
      } else {
        styl = assertNodeType(styl, "textord");
        size = stylArray[Number(styl.text)];
      }
      return wrapWithStyle({
        type: "genfrac",
        mode: parser.mode,
        numer,
        denom,
        continued: false,
        hasBarLine,
        barSize,
        leftDelim,
        rightDelim
      }, size);
    }
  });
  defineFunction({
    type: "infix",
    names: ["\\above"],
    props: {
      numArgs: 1,
      argTypes: ["size"],
      infix: true
    },
    handler(_ref4, args) {
      var {
        parser,
        funcName,
        token
      } = _ref4;
      return {
        type: "infix",
        mode: parser.mode,
        replaceWith: "\\\\abovefrac",
        size: assertNodeType(args[0], "size").value,
        token
      };
    }
  });
  defineFunction({
    type: "genfrac",
    names: ["\\\\abovefrac"],
    props: {
      numArgs: 3,
      argTypes: ["math", "size", "math"]
    },
    handler: (_ref5, args) => {
      var {
        parser,
        funcName
      } = _ref5;
      var numer = args[0];
      var barSize = assertNodeType(args[1], "infix").size;
      if (!barSize) {
        throw new Error("\\\\abovefrac expected size, but got " + String(barSize));
      }
      var denom = args[2];
      var hasBarLine = barSize.number > 0;
      return {
        type: "genfrac",
        mode: parser.mode,
        numer,
        denom,
        continued: false,
        hasBarLine,
        barSize,
        leftDelim: null,
        rightDelim: null
      };
    }
  });
  var htmlBuilder$3 = (grp, options) => {
    var style = options.style;
    var supSubGroup;
    var group;
    if (grp.type === "supsub") {
      supSubGroup = grp.sup ? buildGroup$1(grp.sup, options.havingStyle(style.sup()), options) : buildGroup$1(grp.sub, options.havingStyle(style.sub()), options);
      group = assertNodeType(grp.base, "horizBrace");
    } else {
      group = assertNodeType(grp, "horizBrace");
    }
    var body = buildGroup$1(group.base, options.havingBaseStyle(Style$1.DISPLAY));
    var braceBody = stretchySvg(group, options);
    var vlist;
    if (group.isOver) {
      vlist = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: body
        }, {
          type: "kern",
          size: 0.1
        }, {
          type: "elem",
          elem: braceBody,
          wrapperClasses: ["svg-align"]
        }]
      });
    } else {
      vlist = makeVList({
        positionType: "bottom",
        positionData: body.depth + 0.1 + braceBody.height,
        children: [{
          type: "elem",
          elem: braceBody,
          wrapperClasses: ["svg-align"]
        }, {
          type: "kern",
          size: 0.1
        }, {
          type: "elem",
          elem: body
        }]
      });
    }
    if (supSubGroup) {
      var vSpan = makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
      if (group.isOver) {
        vlist = makeVList({
          positionType: "firstBaseline",
          children: [{
            type: "elem",
            elem: vSpan
          }, {
            type: "kern",
            size: 0.2
          }, {
            type: "elem",
            elem: supSubGroup
          }]
        });
      } else {
        vlist = makeVList({
          positionType: "bottom",
          positionData: vSpan.depth + 0.2 + supSubGroup.height + supSubGroup.depth,
          children: [{
            type: "elem",
            elem: supSubGroup
          }, {
            type: "kern",
            size: 0.2
          }, {
            type: "elem",
            elem: vSpan
          }]
        });
      }
    }
    return makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
  };
  var mathmlBuilder$2 = (group, options) => {
    var accentNode = stretchyMathML(group.label);
    return new MathNode(group.isOver ? "mover" : "munder", [buildGroup2(group.base, options), accentNode]);
  };
  defineFunction({
    type: "horizBrace",
    names: ["\\overbrace", "\\underbrace", "\\overbracket", "\\underbracket"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      return {
        type: "horizBrace",
        mode: parser.mode,
        label: funcName,
        isOver: funcName.includes("\\over"),
        base: args[0]
      };
    },
    htmlBuilder: htmlBuilder$3,
    mathmlBuilder: mathmlBuilder$2
  });
  defineFunction({
    type: "href",
    names: ["\\href"],
    props: {
      numArgs: 2,
      argTypes: ["url", "original"],
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      var body = args[1];
      var href = assertNodeType(args[0], "url").url;
      if (!parser.settings.isTrusted({
        command: "\\href",
        url: href
      })) {
        return parser.formatUnsupportedCmd("\\href");
      }
      return {
        type: "href",
        mode: parser.mode,
        href,
        body: ordargument(body)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options, false);
      return makeAnchor(group.href, [], elements, options);
    },
    mathmlBuilder: (group, options) => {
      var math3 = buildExpressionRow(group.body, options);
      if (!(math3 instanceof MathNode)) {
        math3 = new MathNode("mrow", [math3]);
      }
      math3.setAttribute("href", group.href);
      return math3;
    }
  });
  defineFunction({
    type: "href",
    names: ["\\url"],
    props: {
      numArgs: 1,
      argTypes: ["url"],
      allowedInText: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var href = assertNodeType(args[0], "url").url;
      if (!parser.settings.isTrusted({
        command: "\\url",
        url: href
      })) {
        return parser.formatUnsupportedCmd("\\url");
      }
      var chars = [];
      for (var i = 0; i < href.length; i++) {
        var c2 = href[i];
        if (c2 === "~") {
          c2 = "\\textasciitilde";
        }
        chars.push({
          type: "textord",
          mode: "text",
          text: c2
        });
      }
      var body = {
        type: "text",
        mode: parser.mode,
        font: "\\texttt",
        body: chars
      };
      return {
        type: "href",
        mode: parser.mode,
        href,
        body: ordargument(body)
      };
    }
  });
  defineFunction({
    type: "hbox",
    names: ["\\hbox"],
    props: {
      numArgs: 1,
      argTypes: ["text"],
      allowedInText: true,
      primitive: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "hbox",
        mode: parser.mode,
        body: ordargument(args[0])
      };
    },
    htmlBuilder(group, options) {
      var elements = buildExpression$1(group.body, options.withFont(""), false);
      return makeFragment(elements);
    },
    mathmlBuilder(group, options) {
      return new MathNode("mrow", buildExpression2(group.body, options.withFont("")));
    }
  });
  defineFunction({
    type: "html",
    names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
    props: {
      numArgs: 2,
      argTypes: ["raw", "original"],
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName,
        token
      } = _ref;
      var value = assertNodeType(args[0], "raw").string;
      var body = args[1];
      if (parser.settings.strict) {
        parser.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
      }
      var trustContext;
      var attributes = {};
      switch (funcName) {
        case "\\htmlClass":
          attributes.class = value;
          trustContext = {
            command: "\\htmlClass",
            class: value
          };
          break;
        case "\\htmlId":
          attributes.id = value;
          trustContext = {
            command: "\\htmlId",
            id: value
          };
          break;
        case "\\htmlStyle":
          attributes.style = value;
          trustContext = {
            command: "\\htmlStyle",
            style: value
          };
          break;
        case "\\htmlData": {
          var data = value.split(",");
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var firstEquals = item.indexOf("=");
            if (firstEquals < 0) {
              throw new ParseError("\\htmlData key/value '" + item + "' missing equals sign");
            }
            var key = item.slice(0, firstEquals);
            var _value = item.slice(firstEquals + 1);
            attributes["data-" + key.trim()] = _value;
          }
          trustContext = {
            command: "\\htmlData",
            attributes
          };
          break;
        }
        default:
          throw new Error("Unrecognized html command");
      }
      if (!parser.settings.isTrusted(trustContext)) {
        return parser.formatUnsupportedCmd(funcName);
      }
      return {
        type: "html",
        mode: parser.mode,
        attributes,
        body: ordargument(body)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options, false);
      var classes = ["enclosing"];
      if (group.attributes.class) {
        classes.push(...group.attributes.class.trim().split(/\s+/));
      }
      var span = makeSpan(classes, elements, options);
      for (var attr in group.attributes) {
        if (attr !== "class" && group.attributes.hasOwnProperty(attr)) {
          span.setAttribute(attr, group.attributes[attr]);
        }
      }
      return span;
    },
    mathmlBuilder: (group, options) => {
      return buildExpressionRow(group.body, options);
    }
  });
  defineFunction({
    type: "htmlmathml",
    names: ["\\html@mathml"],
    props: {
      numArgs: 2,
      allowedInArgument: true,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      return {
        type: "htmlmathml",
        mode: parser.mode,
        html: ordargument(args[0]),
        mathml: ordargument(args[1])
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.html, options, false);
      return makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      return buildExpressionRow(group.mathml, options);
    }
  });
  var sizeData = function sizeData2(str) {
    if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(str)) {
      return {
        number: +str,
        unit: "bp"
      };
    } else {
      var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(str);
      if (!match) {
        throw new ParseError("Invalid size: '" + str + "' in \\includegraphics");
      }
      var data = {
        number: +(match[1] + match[2]),
        // sign + magnitude, cast to number
        unit: match[3]
      };
      if (!validUnit(data)) {
        throw new ParseError("Invalid unit: '" + data.unit + "' in \\includegraphics.");
      }
      return data;
    }
  };
  defineFunction({
    type: "includegraphics",
    names: ["\\includegraphics"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1,
      argTypes: ["raw", "url"],
      allowedInText: false
    },
    handler: (_ref, args, optArgs) => {
      var {
        parser
      } = _ref;
      var width = {
        number: 0,
        unit: "em"
      };
      var height = {
        number: 0.9,
        unit: "em"
      };
      var totalheight = {
        number: 0,
        unit: "em"
      };
      var alt = "";
      if (optArgs[0]) {
        var attributeStr = assertNodeType(optArgs[0], "raw").string;
        var attributes = attributeStr.split(",");
        for (var i = 0; i < attributes.length; i++) {
          var keyVal = attributes[i].split("=");
          if (keyVal.length === 2) {
            var str = keyVal[1].trim();
            switch (keyVal[0].trim()) {
              case "alt":
                alt = str;
                break;
              case "width":
                width = sizeData(str);
                break;
              case "height":
                height = sizeData(str);
                break;
              case "totalheight":
                totalheight = sizeData(str);
                break;
              default:
                throw new ParseError("Invalid key: '" + keyVal[0] + "' in \\includegraphics.");
            }
          }
        }
      }
      var src = assertNodeType(args[0], "url").url;
      if (alt === "") {
        alt = src;
        alt = alt.replace(/^.*[\\/]/, "");
        alt = alt.substring(0, alt.lastIndexOf("."));
      }
      if (!parser.settings.isTrusted({
        command: "\\includegraphics",
        url: src
      })) {
        return parser.formatUnsupportedCmd("\\includegraphics");
      }
      return {
        type: "includegraphics",
        mode: parser.mode,
        alt,
        width,
        height,
        totalheight,
        src
      };
    },
    htmlBuilder: (group, options) => {
      var height = calculateSize(group.height, options);
      var depth = 0;
      if (group.totalheight.number > 0) {
        depth = calculateSize(group.totalheight, options) - height;
      }
      var width = 0;
      if (group.width.number > 0) {
        width = calculateSize(group.width, options);
      }
      var style = {
        height: makeEm(height + depth)
      };
      if (width > 0) {
        style.width = makeEm(width);
      }
      if (depth > 0) {
        style.verticalAlign = makeEm(-depth);
      }
      var node = new Img(group.src, group.alt, style);
      node.height = height;
      node.depth = depth;
      return node;
    },
    mathmlBuilder: (group, options) => {
      var node = new MathNode("mglyph", []);
      node.setAttribute("alt", group.alt);
      var height = calculateSize(group.height, options);
      var depth = 0;
      if (group.totalheight.number > 0) {
        depth = calculateSize(group.totalheight, options) - height;
        node.setAttribute("valign", makeEm(-depth));
      }
      node.setAttribute("height", makeEm(height + depth));
      if (group.width.number > 0) {
        var width = calculateSize(group.width, options);
        node.setAttribute("width", makeEm(width));
      }
      node.setAttribute("src", group.src);
      return node;
    }
  });
  defineFunction({
    type: "kern",
    names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
    props: {
      numArgs: 1,
      argTypes: ["size"],
      primitive: true,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var size = assertNodeType(args[0], "size");
      if (parser.settings.strict) {
        var mathFunction = funcName[1] === "m";
        var muUnit = size.value.unit === "mu";
        if (mathFunction) {
          if (!muUnit) {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " supports only mu units, " + ("not " + size.value.unit + " units"));
          }
          if (parser.mode !== "math") {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " works only in math mode");
          }
        } else {
          if (muUnit) {
            parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " doesn't support mu units");
          }
        }
      }
      return {
        type: "kern",
        mode: parser.mode,
        dimension: size.value
      };
    },
    htmlBuilder(group, options) {
      return makeGlue(group.dimension, options);
    },
    mathmlBuilder(group, options) {
      var dimension = calculateSize(group.dimension, options);
      return new SpaceNode(dimension);
    }
  });
  defineFunction({
    type: "lap",
    names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body = args[0];
      return {
        type: "lap",
        mode: parser.mode,
        alignment: funcName.slice(5),
        body
      };
    },
    htmlBuilder: (group, options) => {
      var inner2;
      if (group.alignment === "clap") {
        inner2 = makeSpan([], [buildGroup$1(group.body, options)]);
        inner2 = makeSpan(["inner"], [inner2], options);
      } else {
        inner2 = makeSpan(["inner"], [buildGroup$1(group.body, options)]);
      }
      var fix = makeSpan(["fix"], []);
      var node = makeSpan([group.alignment], [inner2, fix], options);
      var strut = makeSpan(["strut"]);
      strut.style.height = makeEm(node.height + node.depth);
      if (node.depth) {
        strut.style.verticalAlign = makeEm(-node.depth);
      }
      node.children.unshift(strut);
      node = makeSpan(["thinbox"], [node], options);
      return makeSpan(["mord", "vbox"], [node], options);
    },
    mathmlBuilder: (group, options) => {
      var node = new MathNode("mpadded", [buildGroup2(group.body, options)]);
      if (group.alignment !== "rlap") {
        var offset = group.alignment === "llap" ? "-1" : "-0.5";
        node.setAttribute("lspace", offset + "width");
      }
      node.setAttribute("width", "0px");
      return node;
    }
  });
  defineFunction({
    type: "styling",
    names: ["\\(", "$"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: false
    },
    handler(_ref, args) {
      var {
        funcName,
        parser
      } = _ref;
      var outerMode = parser.mode;
      parser.switchMode("math");
      var close2 = funcName === "\\(" ? "\\)" : "$";
      var body = parser.parseExpression(false, close2);
      parser.expect(close2);
      parser.switchMode(outerMode);
      return {
        type: "styling",
        mode: parser.mode,
        style: "text",
        resetFont: true,
        body
      };
    }
  });
  defineFunction({
    type: "text",
    // Doesn't matter what this is.
    names: ["\\)", "\\]"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInMath: false
    },
    handler(context, args) {
      throw new ParseError("Mismatched " + context.funcName);
    }
  });
  var chooseMathStyle = (group, options) => {
    switch (options.style.size) {
      case Style$1.DISPLAY.size:
        return group.display;
      case Style$1.TEXT.size:
        return group.text;
      case Style$1.SCRIPT.size:
        return group.script;
      case Style$1.SCRIPTSCRIPT.size:
        return group.scriptscript;
      default:
        return group.text;
    }
  };
  defineFunction({
    type: "mathchoice",
    names: ["\\mathchoice"],
    props: {
      numArgs: 4,
      primitive: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      return {
        type: "mathchoice",
        mode: parser.mode,
        display: ordargument(args[0]),
        text: ordargument(args[1]),
        script: ordargument(args[2]),
        scriptscript: ordargument(args[3])
      };
    },
    htmlBuilder: (group, options) => {
      var body = chooseMathStyle(group, options);
      var elements = buildExpression$1(body, options, false);
      return makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      var body = chooseMathStyle(group, options);
      return buildExpressionRow(body, options);
    }
  });
  var assembleSupSub = (base, supGroup, subGroup, options, style, slant, baseShift) => {
    base = makeSpan([], [base]);
    var subIsSingleCharacter = subGroup && isCharacterBox(subGroup);
    var sub2;
    var sup2;
    if (supGroup) {
      var elem = buildGroup$1(supGroup, options.havingStyle(style.sup()), options);
      sup2 = {
        elem,
        kern: Math.max(options.fontMetrics().bigOpSpacing1, options.fontMetrics().bigOpSpacing3 - elem.depth)
      };
    }
    if (subGroup) {
      var _elem = buildGroup$1(subGroup, options.havingStyle(style.sub()), options);
      sub2 = {
        elem: _elem,
        kern: Math.max(options.fontMetrics().bigOpSpacing2, options.fontMetrics().bigOpSpacing4 - _elem.height)
      };
    }
    var finalGroup;
    if (sup2 && sub2) {
      var bottom = options.fontMetrics().bigOpSpacing5 + sub2.elem.height + sub2.elem.depth + sub2.kern + base.depth + baseShift;
      finalGroup = makeVList({
        positionType: "bottom",
        positionData: bottom,
        children: [{
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }, {
          type: "elem",
          elem: sub2.elem,
          marginLeft: makeEm(-slant)
        }, {
          type: "kern",
          size: sub2.kern
        }, {
          type: "elem",
          elem: base
        }, {
          type: "kern",
          size: sup2.kern
        }, {
          type: "elem",
          elem: sup2.elem,
          marginLeft: makeEm(slant)
        }, {
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }]
      });
    } else if (sub2) {
      var top = base.height - baseShift;
      finalGroup = makeVList({
        positionType: "top",
        positionData: top,
        children: [{
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }, {
          type: "elem",
          elem: sub2.elem,
          marginLeft: makeEm(-slant)
        }, {
          type: "kern",
          size: sub2.kern
        }, {
          type: "elem",
          elem: base
        }]
      });
    } else if (sup2) {
      var _bottom = base.depth + baseShift;
      finalGroup = makeVList({
        positionType: "bottom",
        positionData: _bottom,
        children: [{
          type: "elem",
          elem: base
        }, {
          type: "kern",
          size: sup2.kern
        }, {
          type: "elem",
          elem: sup2.elem,
          marginLeft: makeEm(slant)
        }, {
          type: "kern",
          size: options.fontMetrics().bigOpSpacing5
        }]
      });
    } else {
      return base;
    }
    var parts = [finalGroup];
    if (sub2 && slant !== 0 && !subIsSingleCharacter) {
      var spacer = makeSpan(["mspace"], [], options);
      spacer.style.marginRight = makeEm(slant);
      parts.unshift(spacer);
    }
    return makeSpan(["mop", "op-limits"], parts, options);
  };
  var noSuccessor = /* @__PURE__ */ new Set(["\\smallint"]);
  var htmlBuilder$2 = (grp, options) => {
    var supGroup;
    var subGroup;
    var hasLimits = false;
    var group;
    if (grp.type === "supsub") {
      supGroup = grp.sup;
      subGroup = grp.sub;
      group = assertNodeType(grp.base, "op");
      hasLimits = true;
    } else {
      group = assertNodeType(grp, "op");
    }
    var style = options.style;
    var large = false;
    if (style.size === Style$1.DISPLAY.size && group.symbol && !noSuccessor.has(group.name)) {
      large = true;
    }
    var base;
    var symbolItalic;
    if (group.symbol) {
      var fontName = large ? "Size2-Regular" : "Size1-Regular";
      var stash = "";
      if (group.name === "\\oiint" || group.name === "\\oiiint") {
        stash = group.name.slice(1);
        group.name = stash === "oiint" ? "\\iint" : "\\iiint";
      }
      base = makeSymbol(group.name, fontName, "math", options, ["mop", "op-symbol", large ? "large-op" : "small-op"]);
      symbolItalic = base.italic;
      if (stash.length > 0) {
        var oval = staticSvg(stash + "Size" + (large ? "2" : "1"), options);
        base = makeVList({
          positionType: "individualShift",
          children: [{
            type: "elem",
            elem: base,
            shift: 0
          }, {
            type: "elem",
            elem: oval,
            shift: large ? 0.08 : 0
          }]
        });
        group.name = "\\" + stash;
        base.classes.unshift("mop");
        base.italic = symbolItalic;
      }
    } else if (group.body) {
      var inner2 = buildExpression$1(group.body, options, true);
      if (inner2.length === 1 && inner2[0] instanceof SymbolNode) {
        base = inner2[0];
        base.classes[0] = "mop";
      } else {
        base = makeSpan(["mop"], inner2, options);
      }
    } else {
      var output = [];
      for (var i = 1; i < group.name.length; i++) {
        output.push(mathsym(group.name[i], group.mode, options));
      }
      base = makeSpan(["mop"], output, options);
    }
    var baseShift = 0;
    var slant = 0;
    if ((base instanceof SymbolNode || group.name === "\\oiint" || group.name === "\\oiiint") && !group.suppressBaseShift) {
      var _base$italic;
      baseShift = (base.height - base.depth) / 2 - options.fontMetrics().axisHeight;
      slant = (_base$italic = base.italic) != null ? _base$italic : 0;
    }
    if (hasLimits) {
      return assembleSupSub(base, supGroup, subGroup, options, style, slant, baseShift);
    } else {
      if (baseShift) {
        base.style.position = "relative";
        base.style.top = makeEm(baseShift);
      }
      return base;
    }
  };
  var mathmlBuilder$1 = (group, options) => {
    var node;
    if (group.symbol) {
      node = new MathNode("mo", [makeText(group.name, group.mode)]);
      if (noSuccessor.has(group.name)) {
        node.setAttribute("largeop", "false");
      }
    } else if (group.body) {
      node = new MathNode("mo", buildExpression2(group.body, options));
    } else {
      node = new MathNode("mi", [new TextNode(group.name.slice(1))]);
      var operator = new MathNode("mo", [makeText("\u2061", "text")]);
      if (group.parentIsSupSub) {
        node = new MathNode("mrow", [node, operator]);
      } else {
        node = newDocumentFragment([node, operator]);
      }
    }
    return node;
  };
  var singleCharBigOps = {
    "\u220F": "\\prod",
    "\u2210": "\\coprod",
    "\u2211": "\\sum",
    "\u22C0": "\\bigwedge",
    "\u22C1": "\\bigvee",
    "\u22C2": "\\bigcap",
    "\u22C3": "\\bigcup",
    "\u2A00": "\\bigodot",
    "\u2A01": "\\bigoplus",
    "\u2A02": "\\bigotimes",
    "\u2A04": "\\biguplus",
    "\u2A06": "\\bigsqcup"
  };
  defineFunction({
    type: "op",
    names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "\u220F", "\u2210", "\u2211", "\u22C0", "\u22C1", "\u22C2", "\u22C3", "\u2A00", "\u2A01", "\u2A02", "\u2A04", "\u2A06"],
    props: {
      numArgs: 0
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var fName = funcName;
      if (fName.length === 1) {
        fName = singleCharBigOps[fName];
      }
      return {
        type: "op",
        mode: parser.mode,
        limits: true,
        parentIsSupSub: false,
        symbol: true,
        name: fName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\mathop"],
    props: {
      numArgs: 1,
      primitive: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body = args[0];
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: false,
        body: ordargument(body)
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  var singleCharIntegrals = {
    "\u222B": "\\int",
    "\u222C": "\\iint",
    "\u222D": "\\iiint",
    "\u222E": "\\oint",
    "\u222F": "\\oiint",
    "\u2230": "\\oiiint"
  };
  defineFunction({
    type: "op",
    names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
    props: {
      numArgs: 0
    },
    handler(_ref3) {
      var {
        parser,
        funcName
      } = _ref3;
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: false,
        name: funcName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
    props: {
      numArgs: 0
    },
    handler(_ref4) {
      var {
        parser,
        funcName
      } = _ref4;
      return {
        type: "op",
        mode: parser.mode,
        limits: true,
        parentIsSupSub: false,
        symbol: false,
        name: funcName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  defineFunction({
    type: "op",
    names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "\u222B", "\u222C", "\u222D", "\u222E", "\u222F", "\u2230"],
    props: {
      numArgs: 0,
      allowedInArgument: true
    },
    handler(_ref5) {
      var {
        parser,
        funcName
      } = _ref5;
      var fName = funcName;
      if (fName.length === 1) {
        fName = singleCharIntegrals[fName];
      }
      return {
        type: "op",
        mode: parser.mode,
        limits: false,
        parentIsSupSub: false,
        symbol: true,
        name: fName
      };
    },
    htmlBuilder: htmlBuilder$2,
    mathmlBuilder: mathmlBuilder$1
  });
  var htmlBuilder$1 = (grp, options) => {
    var supGroup;
    var subGroup;
    var hasLimits = false;
    var group;
    if (grp.type === "supsub") {
      supGroup = grp.sup;
      subGroup = grp.sub;
      group = assertNodeType(grp.base, "operatorname");
      hasLimits = true;
    } else {
      group = assertNodeType(grp, "operatorname");
    }
    var base;
    if (group.body.length > 0) {
      var body = group.body.map((child2) => {
        var childText = "text" in child2 ? child2.text : void 0;
        if (typeof childText === "string") {
          return {
            type: "textord",
            mode: child2.mode,
            text: childText
          };
        } else {
          return child2;
        }
      });
      var expression = buildExpression$1(body, options.withFont("mathrm"), true);
      for (var i = 0; i < expression.length; i++) {
        var child = expression[i];
        if (child instanceof SymbolNode) {
          child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
        }
      }
      base = makeSpan(["mop"], expression, options);
    } else {
      base = makeSpan(["mop"], [], options);
    }
    if (hasLimits) {
      return assembleSupSub(base, supGroup, subGroup, options, options.style, 0, 0);
    } else {
      return base;
    }
  };
  var mathmlBuilder2 = (group, options) => {
    var expression = buildExpression2(group.body, options.withFont("mathrm"));
    var isAllString = true;
    for (var i = 0; i < expression.length; i++) {
      var node = expression[i];
      if (node instanceof SpaceNode) ;
      else if (node instanceof MathNode) {
        switch (node.type) {
          case "mi":
          case "mn":
          case "mspace":
          case "mtext":
            break;
          // Do nothing yet.
          case "mo": {
            var child = node.children[0];
            if (node.children.length === 1 && child instanceof TextNode) {
              child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
            } else {
              isAllString = false;
            }
            break;
          }
          default:
            isAllString = false;
        }
      } else {
        isAllString = false;
      }
    }
    if (isAllString) {
      var word = expression.map((node2) => node2.toText()).join("");
      expression = [new TextNode(word)];
    }
    var identifier = new MathNode("mi", expression);
    identifier.setAttribute("mathvariant", "normal");
    var operator = new MathNode("mo", [makeText("\u2061", "text")]);
    if (group.parentIsSupSub) {
      return new MathNode("mrow", [identifier, operator]);
    } else {
      return newDocumentFragment([identifier, operator]);
    }
  };
  defineFunction({
    type: "operatorname",
    names: ["\\operatorname@", "\\operatornamewithlimits"],
    props: {
      numArgs: 1
    },
    handler: (_ref, args) => {
      var {
        parser,
        funcName
      } = _ref;
      var body = args[0];
      return {
        type: "operatorname",
        mode: parser.mode,
        body: ordargument(body),
        alwaysHandleSupSub: funcName === "\\operatornamewithlimits",
        limits: false,
        parentIsSupSub: false
      };
    },
    htmlBuilder: htmlBuilder$1,
    mathmlBuilder: mathmlBuilder2
  });
  defineMacro("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
  defineFunctionBuilders({
    type: "ordgroup",
    htmlBuilder(group, options) {
      if (group.semisimple) {
        return makeFragment(buildExpression$1(group.body, options, false));
      }
      return makeSpan(["mord"], buildExpression$1(group.body, options, true), options);
    },
    mathmlBuilder(group, options) {
      return buildExpressionRow(group.body, options, true);
    }
  });
  defineFunction({
    type: "overline",
    names: ["\\overline"],
    props: {
      numArgs: 1
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var body = args[0];
      return {
        type: "overline",
        mode: parser.mode,
        body
      };
    },
    htmlBuilder(group, options) {
      var innerGroup = buildGroup$1(group.body, options.havingCrampedStyle());
      var line = makeLineSpan("overline-line", options);
      var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
      var vlist = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: innerGroup
        }, {
          type: "kern",
          size: 3 * defaultRuleThickness
        }, {
          type: "elem",
          elem: line
        }, {
          type: "kern",
          size: defaultRuleThickness
        }]
      });
      return makeSpan(["mord", "overline"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var operator = new MathNode("mo", [new TextNode("\u203E")]);
      operator.setAttribute("stretchy", "true");
      var node = new MathNode("mover", [buildGroup2(group.body, options), operator]);
      node.setAttribute("accent", "true");
      return node;
    }
  });
  defineFunction({
    type: "phantom",
    names: ["\\phantom"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        parser
      } = _ref;
      var body = args[0];
      return {
        type: "phantom",
        mode: parser.mode,
        body: ordargument(body)
      };
    },
    htmlBuilder: (group, options) => {
      var elements = buildExpression$1(group.body, options.withPhantom(), false);
      return makeFragment(elements);
    },
    mathmlBuilder: (group, options) => {
      var inner2 = buildExpression2(group.body, options);
      return new MathNode("mphantom", inner2);
    }
  });
  defineMacro("\\hphantom", "\\smash{\\phantom{#1}}");
  defineFunction({
    type: "vphantom",
    names: ["\\vphantom"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler: (_ref2, args) => {
      var {
        parser
      } = _ref2;
      var body = args[0];
      return {
        type: "vphantom",
        mode: parser.mode,
        body
      };
    },
    htmlBuilder: (group, options) => {
      var inner2 = makeSpan(["inner"], [buildGroup$1(group.body, options.withPhantom())]);
      var fix = makeSpan(["fix"], []);
      return makeSpan(["mord", "rlap"], [inner2, fix], options);
    },
    mathmlBuilder: (group, options) => {
      var inner2 = buildExpression2(ordargument(group.body), options);
      var phantom = new MathNode("mphantom", inner2);
      var node = new MathNode("mpadded", [phantom]);
      node.setAttribute("width", "0px");
      return node;
    }
  });
  defineFunction({
    type: "raisebox",
    names: ["\\raisebox"],
    props: {
      numArgs: 2,
      argTypes: ["size", "hbox"],
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      var amount = assertNodeType(args[0], "size").value;
      var body = args[1];
      return {
        type: "raisebox",
        mode: parser.mode,
        dy: amount,
        body
      };
    },
    htmlBuilder(group, options) {
      var body = buildGroup$1(group.body, options);
      var dy = calculateSize(group.dy, options);
      return makeVList({
        positionType: "shift",
        positionData: -dy,
        children: [{
          type: "elem",
          elem: body
        }]
      });
    },
    mathmlBuilder(group, options) {
      var node = new MathNode("mpadded", [buildGroup2(group.body, options)]);
      var dy = group.dy.number + group.dy.unit;
      node.setAttribute("voffset", dy);
      return node;
    }
  });
  defineFunction({
    type: "internal",
    names: ["\\relax"],
    props: {
      numArgs: 0,
      allowedInText: true,
      allowedInArgument: true
    },
    handler(_ref) {
      var {
        parser
      } = _ref;
      return {
        type: "internal",
        mode: parser.mode
      };
    }
  });
  defineFunction({
    type: "rule",
    names: ["\\rule"],
    props: {
      numArgs: 2,
      numOptionalArgs: 1,
      allowedInText: true,
      allowedInMath: true,
      argTypes: ["size", "size", "size"]
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var shift = optArgs[0];
      var width = assertNodeType(args[0], "size");
      var height = assertNodeType(args[1], "size");
      return {
        type: "rule",
        mode: parser.mode,
        shift: shift && assertNodeType(shift, "size").value,
        width: width.value,
        height: height.value
      };
    },
    htmlBuilder(group, options) {
      var rule = makeSpan(["mord", "rule"], [], options);
      var width = calculateSize(group.width, options);
      var height = calculateSize(group.height, options);
      var shift = group.shift ? calculateSize(group.shift, options) : 0;
      rule.style.borderRightWidth = makeEm(width);
      rule.style.borderTopWidth = makeEm(height);
      rule.style.bottom = makeEm(shift);
      rule.width = width;
      rule.height = height + shift;
      rule.depth = -shift;
      rule.maxFontSize = height * 1.125 * options.sizeMultiplier;
      return rule;
    },
    mathmlBuilder(group, options) {
      var width = calculateSize(group.width, options);
      var height = calculateSize(group.height, options);
      var shift = group.shift ? calculateSize(group.shift, options) : 0;
      var color = options.color && options.getColor() || "black";
      var rule = new MathNode("mspace");
      rule.setAttribute("mathbackground", color);
      rule.setAttribute("width", makeEm(width));
      rule.setAttribute("height", makeEm(height));
      var wrapper = new MathNode("mpadded", [rule]);
      if (shift >= 0) {
        wrapper.setAttribute("height", makeEm(shift));
      } else {
        wrapper.setAttribute("height", makeEm(shift));
        wrapper.setAttribute("depth", makeEm(-shift));
      }
      wrapper.setAttribute("voffset", makeEm(shift));
      return wrapper;
    }
  });
  function sizingGroup(value, options, baseOptions) {
    var inner2 = buildExpression$1(value, options, false);
    var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
    for (var i = 0; i < inner2.length; i++) {
      var pos = inner2[i].classes.indexOf("sizing");
      if (pos < 0) {
        Array.prototype.push.apply(inner2[i].classes, options.sizingClasses(baseOptions));
      } else if (inner2[i].classes[pos + 1] === "reset-size" + options.size) {
        inner2[i].classes[pos + 1] = "reset-size" + baseOptions.size;
      }
      inner2[i].height *= multiplier;
      inner2[i].depth *= multiplier;
    }
    return makeFragment(inner2);
  }
  var sizeFuncs = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"];
  var htmlBuilder2 = (group, options) => {
    var newOptions = options.havingSize(group.size);
    return sizingGroup(group.body, newOptions, options);
  };
  defineFunction({
    type: "sizing",
    names: sizeFuncs,
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler: (_ref, args) => {
      var {
        breakOnTokenText,
        funcName,
        parser
      } = _ref;
      var body = parser.parseExpression(false, breakOnTokenText);
      return {
        type: "sizing",
        mode: parser.mode,
        // Figure out what size to use based on the list of functions above
        size: sizeFuncs.indexOf(funcName) + 1,
        body
      };
    },
    htmlBuilder: htmlBuilder2,
    mathmlBuilder: (group, options) => {
      var newOptions = options.havingSize(group.size);
      var inner2 = buildExpression2(group.body, newOptions);
      var node = new MathNode("mstyle", inner2);
      node.setAttribute("mathsize", makeEm(newOptions.sizeMultiplier));
      return node;
    }
  });
  defineFunction({
    type: "smash",
    names: ["\\smash"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1,
      allowedInText: true
    },
    handler: (_ref, args, optArgs) => {
      var {
        parser
      } = _ref;
      var smashHeight = false;
      var smashDepth = false;
      var tbArg = optArgs[0] && assertNodeType(optArgs[0], "ordgroup");
      if (tbArg) {
        var letter;
        for (var i = 0; i < tbArg.body.length; ++i) {
          var node = tbArg.body[i];
          letter = assertSymbolNodeType(node).text;
          if (letter === "t") {
            smashHeight = true;
          } else if (letter === "b") {
            smashDepth = true;
          } else {
            smashHeight = false;
            smashDepth = false;
            break;
          }
        }
      } else {
        smashHeight = true;
        smashDepth = true;
      }
      var body = args[0];
      return {
        type: "smash",
        mode: parser.mode,
        body,
        smashHeight,
        smashDepth
      };
    },
    htmlBuilder: (group, options) => {
      var node = makeSpan([], [buildGroup$1(group.body, options)]);
      if (!group.smashHeight && !group.smashDepth) {
        return node;
      }
      if (group.smashHeight) {
        node.height = 0;
      }
      if (group.smashDepth) {
        node.depth = 0;
      }
      if (group.smashHeight && group.smashDepth) {
        return makeSpan(["mord", "smash"], [node], options);
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          if (group.smashHeight) {
            node.children[i].height = 0;
          }
          if (group.smashDepth) {
            node.children[i].depth = 0;
          }
        }
      }
      var smashedNode = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: node
        }]
      });
      return makeSpan(["mord"], [smashedNode], options);
    },
    mathmlBuilder: (group, options) => {
      var node = new MathNode("mpadded", [buildGroup2(group.body, options)]);
      if (group.smashHeight) {
        node.setAttribute("height", "0px");
      }
      if (group.smashDepth) {
        node.setAttribute("depth", "0px");
      }
      return node;
    }
  });
  defineFunction({
    type: "sqrt",
    names: ["\\sqrt"],
    props: {
      numArgs: 1,
      numOptionalArgs: 1
    },
    handler(_ref, args, optArgs) {
      var {
        parser
      } = _ref;
      var index = optArgs[0];
      var body = args[0];
      return {
        type: "sqrt",
        mode: parser.mode,
        body,
        index
      };
    },
    htmlBuilder(group, options) {
      var inner2 = buildGroup$1(group.body, options.havingCrampedStyle());
      if (inner2.height === 0) {
        inner2.height = options.fontMetrics().xHeight;
      }
      inner2 = wrapFragment(inner2, options);
      var metrics = options.fontMetrics();
      var theta = metrics.defaultRuleThickness;
      var phi = theta;
      if (options.style.id < Style$1.TEXT.id) {
        phi = options.fontMetrics().xHeight;
      }
      var lineClearance = theta + phi / 4;
      var minDelimiterHeight = inner2.height + inner2.depth + lineClearance + theta;
      var {
        span: img,
        ruleWidth,
        advanceWidth
      } = makeSqrtImage(minDelimiterHeight, options);
      var delimDepth = img.height - ruleWidth;
      if (delimDepth > inner2.height + inner2.depth + lineClearance) {
        lineClearance = (lineClearance + delimDepth - inner2.height - inner2.depth) / 2;
      }
      var imgShift = img.height - inner2.height - lineClearance - ruleWidth;
      inner2.style.paddingLeft = makeEm(advanceWidth);
      var body = makeVList({
        positionType: "firstBaseline",
        children: [{
          type: "elem",
          elem: inner2,
          wrapperClasses: ["svg-align"]
        }, {
          type: "kern",
          size: -(inner2.height + imgShift)
        }, {
          type: "elem",
          elem: img
        }, {
          type: "kern",
          size: ruleWidth
        }]
      });
      if (!group.index) {
        return makeSpan(["mord", "sqrt"], [body], options);
      } else {
        var newOptions = options.havingStyle(Style$1.SCRIPTSCRIPT);
        var rootm = buildGroup$1(group.index, newOptions, options);
        var toShift = 0.6 * (body.height - body.depth);
        var rootVList = makeVList({
          positionType: "shift",
          positionData: -toShift,
          children: [{
            type: "elem",
            elem: rootm
          }]
        });
        var rootVListWrap = makeSpan(["root"], [rootVList]);
        return makeSpan(["mord", "sqrt"], [rootVListWrap, body], options);
      }
    },
    mathmlBuilder(group, options) {
      var {
        body,
        index
      } = group;
      return index ? new MathNode("mroot", [buildGroup2(body, options), buildGroup2(index, options)]) : new MathNode("msqrt", [buildGroup2(body, options)]);
    }
  });
  var styleMap = {
    "display": Style$1.DISPLAY,
    "text": Style$1.TEXT,
    "script": Style$1.SCRIPT,
    "scriptscript": Style$1.SCRIPTSCRIPT
  };
  function isStyleStr(s) {
    return s in styleMap;
  }
  defineFunction({
    type: "styling",
    names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
    props: {
      numArgs: 0,
      allowedInText: true,
      primitive: true
    },
    handler(_ref, args) {
      var {
        breakOnTokenText,
        funcName,
        parser
      } = _ref;
      var body = parser.parseExpression(true, breakOnTokenText);
      var style = funcName.slice(1, funcName.length - 5);
      if (!isStyleStr(style)) {
        throw new Error("Unknown style: " + style);
      }
      return {
        type: "styling",
        mode: parser.mode,
        // Figure out what style to use by pulling out the style from
        // the function name
        style,
        body
      };
    },
    htmlBuilder(group, options) {
      var newStyle = styleMap[group.style];
      var newOptions = options.havingStyle(newStyle);
      if (group.resetFont) {
        newOptions = newOptions.withFont("");
      }
      return sizingGroup(group.body, newOptions, options);
    },
    mathmlBuilder(group, options) {
      var newStyle = styleMap[group.style];
      var newOptions = options.havingStyle(newStyle);
      if (group.resetFont) {
        newOptions = newOptions.withFont("");
      }
      var inner2 = buildExpression2(group.body, newOptions);
      var node = new MathNode("mstyle", inner2);
      var styleAttributes = {
        "display": ["0", "true"],
        "text": ["0", "false"],
        "script": ["1", "false"],
        "scriptscript": ["2", "false"]
      };
      var attr = styleAttributes[group.style];
      node.setAttribute("scriptlevel", attr[0]);
      node.setAttribute("displaystyle", attr[1]);
      return node;
    }
  });
  var htmlBuilderDelegate = function htmlBuilderDelegate2(group, options) {
    var base = group.base;
    if (!base) {
      return null;
    } else if (base.type === "op") {
      var delegate = base.limits && (options.style.size === Style$1.DISPLAY.size || base.alwaysHandleSupSub);
      return delegate ? htmlBuilder$2 : null;
    } else if (base.type === "operatorname") {
      var _delegate = base.alwaysHandleSupSub && (options.style.size === Style$1.DISPLAY.size || base.limits);
      return _delegate ? htmlBuilder$1 : null;
    } else if (base.type === "accent") {
      return isCharacterBox(base.base) ? htmlBuilder$a : null;
    } else if (base.type === "horizBrace") {
      var isSup = !group.sub;
      return isSup === base.isOver ? htmlBuilder$3 : null;
    } else {
      return null;
    }
  };
  defineFunctionBuilders({
    type: "supsub",
    htmlBuilder(group, options) {
      var builderDelegate = htmlBuilderDelegate(group, options);
      if (builderDelegate) {
        return builderDelegate(group, options);
      }
      var {
        base: valueBase,
        sup: valueSup,
        sub: valueSub
      } = group;
      var base = buildGroup$1(valueBase, options);
      var supm;
      var subm;
      var metrics = options.fontMetrics();
      var supShift = 0;
      var subShift = 0;
      var isCharBox = valueBase && isCharacterBox(valueBase);
      if (valueSup) {
        var newOptions = options.havingStyle(options.style.sup());
        supm = buildGroup$1(valueSup, newOptions, options);
        if (!isCharBox) {
          supShift = base.height - newOptions.fontMetrics().supDrop * newOptions.sizeMultiplier / options.sizeMultiplier;
        }
      }
      if (valueSub) {
        var _newOptions = options.havingStyle(options.style.sub());
        subm = buildGroup$1(valueSub, _newOptions, options);
        if (!isCharBox) {
          subShift = base.depth + _newOptions.fontMetrics().subDrop * _newOptions.sizeMultiplier / options.sizeMultiplier;
        }
      }
      var minSupShift;
      if (options.style === Style$1.DISPLAY) {
        minSupShift = metrics.sup1;
      } else if (options.style.cramped) {
        minSupShift = metrics.sup3;
      } else {
        minSupShift = metrics.sup2;
      }
      var multiplier = options.sizeMultiplier;
      var marginRight = makeEm(0.5 / metrics.ptPerEm / multiplier);
      var marginLeft = null;
      if (subm) {
        var isOiint = group.base && group.base.type === "op" && group.base.name && (group.base.name === "\\oiint" || group.base.name === "\\oiiint");
        if (base instanceof SymbolNode || isOiint) {
          var _base$italic;
          marginLeft = makeEm(-((_base$italic = base.italic) != null ? _base$italic : 0));
        }
      }
      var supsub;
      if (supm && subm) {
        supShift = Math.max(supShift, minSupShift, supm.depth + 0.25 * metrics.xHeight);
        subShift = Math.max(subShift, metrics.sub2);
        var ruleWidth = metrics.defaultRuleThickness;
        var maxWidth = 4 * ruleWidth;
        if (supShift - supm.depth - (subm.height - subShift) < maxWidth) {
          subShift = maxWidth - (supShift - supm.depth) + subm.height;
          var psi = 0.8 * metrics.xHeight - (supShift - supm.depth);
          if (psi > 0) {
            supShift += psi;
            subShift -= psi;
          }
        }
        var vlistElem = [{
          type: "elem",
          elem: subm,
          shift: subShift,
          marginRight,
          marginLeft
        }, {
          type: "elem",
          elem: supm,
          shift: -supShift,
          marginRight
        }];
        supsub = makeVList({
          positionType: "individualShift",
          children: vlistElem
        });
      } else if (subm) {
        subShift = Math.max(subShift, metrics.sub1, subm.height - 0.8 * metrics.xHeight);
        var _vlistElem = [{
          type: "elem",
          elem: subm,
          marginLeft,
          marginRight
        }];
        supsub = makeVList({
          positionType: "shift",
          positionData: subShift,
          children: _vlistElem
        });
      } else if (supm) {
        supShift = Math.max(supShift, minSupShift, supm.depth + 0.25 * metrics.xHeight);
        supsub = makeVList({
          positionType: "shift",
          positionData: -supShift,
          children: [{
            type: "elem",
            elem: supm,
            marginRight
          }]
        });
      } else {
        throw new Error("supsub must have either sup or sub.");
      }
      var mclass = getTypeOfDomTree(base, "right") || "mord";
      return makeSpan([mclass], [base, makeSpan(["msupsub"], [supsub])], options);
    },
    mathmlBuilder(group, options) {
      var isBrace = false;
      var isOver;
      var isSup;
      if (group.base && group.base.type === "horizBrace") {
        isSup = !!group.sup;
        if (isSup === group.base.isOver) {
          isBrace = true;
          isOver = group.base.isOver;
        }
      }
      if (group.base && (group.base.type === "op" || group.base.type === "operatorname")) {
        group.base.parentIsSupSub = true;
      }
      var children = [buildGroup2(group.base, options)];
      if (group.sub) {
        children.push(buildGroup2(group.sub, options));
      }
      if (group.sup) {
        children.push(buildGroup2(group.sup, options));
      }
      var nodeType;
      if (isBrace) {
        nodeType = isOver ? "mover" : "munder";
      } else if (!group.sub) {
        var base = group.base;
        if (base && base.type === "op" && base.limits && (options.style === Style$1.DISPLAY || base.alwaysHandleSupSub)) {
          nodeType = "mover";
        } else if (base && base.type === "operatorname" && base.alwaysHandleSupSub && (base.limits || options.style === Style$1.DISPLAY)) {
          nodeType = "mover";
        } else {
          nodeType = "msup";
        }
      } else if (!group.sup) {
        var _base = group.base;
        if (_base && _base.type === "op" && _base.limits && (options.style === Style$1.DISPLAY || _base.alwaysHandleSupSub)) {
          nodeType = "munder";
        } else if (_base && _base.type === "operatorname" && _base.alwaysHandleSupSub && (_base.limits || options.style === Style$1.DISPLAY)) {
          nodeType = "munder";
        } else {
          nodeType = "msub";
        }
      } else {
        var _base2 = group.base;
        if (_base2 && _base2.type === "op" && _base2.limits && options.style === Style$1.DISPLAY) {
          nodeType = "munderover";
        } else if (_base2 && _base2.type === "operatorname" && _base2.alwaysHandleSupSub && (options.style === Style$1.DISPLAY || _base2.limits)) {
          nodeType = "munderover";
        } else {
          nodeType = "msubsup";
        }
      }
      return new MathNode(nodeType, children);
    }
  });
  defineFunctionBuilders({
    type: "atom",
    htmlBuilder(group, options) {
      return mathsym(group.text, group.mode, options, ["m" + group.family]);
    },
    mathmlBuilder(group, options) {
      var node = new MathNode("mo", [makeText(group.text, group.mode)]);
      if (group.family === "bin") {
        var variant = getVariant(group, options);
        if (variant === "bold-italic") {
          node.setAttribute("mathvariant", variant);
        }
      } else if (group.family === "punct") {
        node.setAttribute("separator", "true");
      } else if (group.family === "open" || group.family === "close") {
        node.setAttribute("stretchy", "false");
      }
      return node;
    }
  });
  var defaultVariant = {
    "mi": "italic",
    "mn": "normal",
    "mtext": "normal"
  };
  defineFunctionBuilders({
    type: "mathord",
    htmlBuilder(group, options) {
      return makeOrd(group, options, "mathord");
    },
    mathmlBuilder(group, options) {
      var node = new MathNode("mi", [makeText(group.text, group.mode, options)]);
      var variant = getVariant(group, options) || "italic";
      if (variant !== defaultVariant[node.type]) {
        node.setAttribute("mathvariant", variant);
      }
      return node;
    }
  });
  defineFunctionBuilders({
    type: "textord",
    htmlBuilder(group, options) {
      return makeOrd(group, options, "textord");
    },
    mathmlBuilder(group, options) {
      var text4 = makeText(group.text, group.mode, options);
      var variant = getVariant(group, options) || "normal";
      var node;
      if (group.mode === "text") {
        node = new MathNode("mtext", [text4]);
      } else if (/[0-9]/.test(group.text)) {
        node = new MathNode("mn", [text4]);
      } else if (group.text === "\\prime") {
        node = new MathNode("mo", [text4]);
      } else {
        node = new MathNode("mi", [text4]);
      }
      if (variant !== defaultVariant[node.type]) {
        node.setAttribute("mathvariant", variant);
      }
      return node;
    }
  });
  var cssSpace = {
    "\\nobreak": "nobreak",
    "\\allowbreak": "allowbreak"
  };
  var regularSpace = {
    " ": {},
    "\\ ": {},
    "~": {
      className: "nobreak"
    },
    "\\space": {},
    "\\nobreakspace": {
      className: "nobreak"
    }
  };
  defineFunctionBuilders({
    type: "spacing",
    htmlBuilder(group, options) {
      if (regularSpace.hasOwnProperty(group.text)) {
        var className = regularSpace[group.text].className || "";
        if (group.mode === "text") {
          var ord = makeOrd(group, options, "textord");
          ord.classes.push(className);
          return ord;
        } else {
          return makeSpan(["mspace", className], [mathsym(group.text, group.mode, options)], options);
        }
      } else if (cssSpace.hasOwnProperty(group.text)) {
        return makeSpan(["mspace", cssSpace[group.text]], [], options);
      } else {
        throw new ParseError('Unknown type of space "' + group.text + '"');
      }
    },
    mathmlBuilder(group, options) {
      var node;
      if (regularSpace.hasOwnProperty(group.text)) {
        node = new MathNode("mtext", [new TextNode("\xA0")]);
      } else if (cssSpace.hasOwnProperty(group.text)) {
        return new MathNode("mspace");
      } else {
        throw new ParseError('Unknown type of space "' + group.text + '"');
      }
      return node;
    }
  });
  var pad = () => {
    var padNode = new MathNode("mtd", []);
    padNode.setAttribute("width", "50%");
    return padNode;
  };
  defineFunctionBuilders({
    type: "tag",
    mathmlBuilder(group, options) {
      var table = new MathNode("mtable", [new MathNode("mtr", [pad(), new MathNode("mtd", [buildExpressionRow(group.body, options)]), pad(), new MathNode("mtd", [buildExpressionRow(group.tag, options)])])]);
      table.setAttribute("width", "100%");
      return table;
    }
  });
  var textFontFamilies = {
    "\\text": void 0,
    "\\textrm": "textrm",
    "\\textsf": "textsf",
    "\\texttt": "texttt",
    "\\textnormal": "textrm"
  };
  var textFontWeights = {
    "\\textbf": "textbf",
    "\\textmd": "textmd"
  };
  var textFontShapes = {
    "\\textit": "textit",
    "\\textup": "textup"
  };
  var optionsWithFont = (group, options) => {
    var font = group.font;
    if (!font) {
      return options;
    } else if (textFontFamilies[font]) {
      return options.withTextFontFamily(textFontFamilies[font]);
    } else if (textFontWeights[font]) {
      return options.withTextFontWeight(textFontWeights[font]);
    } else if (font === "\\emph") {
      return options.fontShape === "textit" ? options.withTextFontShape("textup") : options.withTextFontShape("textit");
    }
    return options.withTextFontShape(textFontShapes[font]);
  };
  defineFunction({
    type: "text",
    names: [
      // Font families
      "\\text",
      "\\textrm",
      "\\textsf",
      "\\texttt",
      "\\textnormal",
      // Font weights
      "\\textbf",
      "\\textmd",
      // Font Shapes
      "\\textit",
      "\\textup",
      "\\emph"
    ],
    props: {
      numArgs: 1,
      argTypes: ["text"],
      allowedInArgument: true,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser,
        funcName
      } = _ref;
      var body = args[0];
      return {
        type: "text",
        mode: parser.mode,
        body: ordargument(body),
        font: funcName
      };
    },
    htmlBuilder(group, options) {
      var newOptions = optionsWithFont(group, options);
      var inner2 = buildExpression$1(group.body, newOptions, true);
      return makeSpan(["mord", "text"], inner2, newOptions);
    },
    mathmlBuilder(group, options) {
      var newOptions = optionsWithFont(group, options);
      return buildExpressionRow(group.body, newOptions);
    }
  });
  defineFunction({
    type: "underline",
    names: ["\\underline"],
    props: {
      numArgs: 1,
      allowedInText: true
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "underline",
        mode: parser.mode,
        body: args[0]
      };
    },
    htmlBuilder(group, options) {
      var innerGroup = buildGroup$1(group.body, options);
      var line = makeLineSpan("underline-line", options);
      var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
      var vlist = makeVList({
        positionType: "top",
        positionData: innerGroup.height,
        children: [{
          type: "kern",
          size: defaultRuleThickness
        }, {
          type: "elem",
          elem: line
        }, {
          type: "kern",
          size: 3 * defaultRuleThickness
        }, {
          type: "elem",
          elem: innerGroup
        }]
      });
      return makeSpan(["mord", "underline"], [vlist], options);
    },
    mathmlBuilder(group, options) {
      var operator = new MathNode("mo", [new TextNode("\u203E")]);
      operator.setAttribute("stretchy", "true");
      var node = new MathNode("munder", [buildGroup2(group.body, options), operator]);
      node.setAttribute("accentunder", "true");
      return node;
    }
  });
  defineFunction({
    type: "vcenter",
    names: ["\\vcenter"],
    props: {
      numArgs: 1,
      argTypes: ["original"],
      // In LaTeX, \vcenter can act only on a box.
      allowedInText: false
    },
    handler(_ref, args) {
      var {
        parser
      } = _ref;
      return {
        type: "vcenter",
        mode: parser.mode,
        body: args[0]
      };
    },
    htmlBuilder(group, options) {
      var body = buildGroup$1(group.body, options);
      var axisHeight = options.fontMetrics().axisHeight;
      var dy = 0.5 * (body.height - axisHeight - (body.depth + axisHeight));
      return makeVList({
        positionType: "shift",
        positionData: dy,
        children: [{
          type: "elem",
          elem: body
        }]
      });
    },
    mathmlBuilder(group, options) {
      var mpadded = new MathNode("mpadded", [buildGroup2(group.body, options)], ["vcenter"]);
      return new MathNode("mrow", [mpadded]);
    }
  });
  defineFunction({
    type: "verb",
    names: ["\\verb"],
    props: {
      numArgs: 0,
      allowedInText: true
    },
    handler(context, args, optArgs) {
      throw new ParseError("\\verb ended by end of line instead of matching delimiter");
    },
    htmlBuilder(group, options) {
      var text4 = makeVerb(group);
      var body = [];
      var newOptions = options.havingStyle(options.style.text());
      for (var i = 0; i < text4.length; i++) {
        var c2 = text4[i];
        if (c2 === "~") {
          c2 = "\\textasciitilde";
        }
        body.push(makeSymbol(c2, "Typewriter-Regular", group.mode, newOptions, ["mord", "texttt"]));
      }
      return makeSpan(["mord", "text"].concat(newOptions.sizingClasses(options)), tryCombineChars(body), newOptions);
    },
    mathmlBuilder(group, options) {
      var text4 = new TextNode(makeVerb(group));
      var node = new MathNode("mtext", [text4]);
      node.setAttribute("mathvariant", "monospace");
      return node;
    }
  });
  var makeVerb = (group) => group.body.replace(/ /g, group.star ? "\u2423" : "\xA0");
  var functions = _functions;
  var spaceRegexString = "[ \r\n	]";
  var controlWordRegexString = "\\\\[a-zA-Z@]+";
  var controlSymbolRegexString = "\\\\[^\uD800-\uDFFF]";
  var controlWordWhitespaceRegexString = "(" + controlWordRegexString + ")" + spaceRegexString + "*";
  var controlSpaceRegexString = "\\\\(\n|[ \r	]+\n?)[ \r	]*";
  var combiningDiacriticalMarkString = "[\u0300-\u036F]";
  var combiningDiacriticalMarksEndRegex = new RegExp(combiningDiacriticalMarkString + "+$");
  var tokenRegexString = "(" + spaceRegexString + "+)|" + // whitespace
  (controlSpaceRegexString + "|") + // \whitespace
  "([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF]" + // single codepoint
  (combiningDiacriticalMarkString + "*") + // ...plus accents
  "|[\uD800-\uDBFF][\uDC00-\uDFFF]" + // surrogate pair
  (combiningDiacriticalMarkString + "*") + // ...plus accents
  "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + // \verb unstarred
  ("|" + controlWordWhitespaceRegexString) + // \macroName + spaces
  ("|" + controlSymbolRegexString + ")");
  var Lexer = class {
    constructor(input, settings) {
      this.input = void 0;
      this.settings = void 0;
      this.tokenRegex = void 0;
      this.catcodes = void 0;
      this.input = input;
      this.settings = settings;
      this.tokenRegex = new RegExp(tokenRegexString, "g");
      this.catcodes = {
        "%": 14,
        // comment character
        "~": 13
        // active character
      };
    }
    setCatcode(char, code) {
      this.catcodes[char] = code;
    }
    /**
     * This function lexes a single token.
     */
    lex() {
      var input = this.input;
      var pos = this.tokenRegex.lastIndex;
      if (pos === input.length) {
        return new Token("EOF", new SourceLocation(this, pos, pos));
      }
      var match = this.tokenRegex.exec(input);
      if (match === null || match.index !== pos) {
        throw new ParseError("Unexpected character: '" + input[pos] + "'", new Token(input[pos], new SourceLocation(this, pos, pos + 1)));
      }
      var text4 = match[6] || match[3] || (match[2] ? "\\ " : " ");
      if (this.catcodes[text4] === 14) {
        var nlIndex = input.indexOf("\n", this.tokenRegex.lastIndex);
        if (nlIndex === -1) {
          this.tokenRegex.lastIndex = input.length;
          this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)");
        } else {
          this.tokenRegex.lastIndex = nlIndex + 1;
        }
        return this.lex();
      }
      return new Token(text4, new SourceLocation(this, pos, this.tokenRegex.lastIndex));
    }
  };
  var Namespace = class {
    /**
     * Both arguments are optional.  The first argument is an object of
     * built-in mappings which never change.  The second argument is an object
     * of initial (global-level) mappings, which will constantly change
     * according to any global/top-level `set`s done.
     */
    constructor(builtins, globalMacros) {
      if (builtins === void 0) {
        builtins = {};
      }
      if (globalMacros === void 0) {
        globalMacros = {};
      }
      this.current = void 0;
      this.builtins = void 0;
      this.undefStack = void 0;
      this.current = globalMacros;
      this.builtins = builtins;
      this.undefStack = [];
    }
    /**
     * Start a new nested group, affecting future local `set`s.
     */
    beginGroup() {
      this.undefStack.push({});
    }
    /**
     * End current nested group, restoring values before the group began.
     */
    endGroup() {
      if (this.undefStack.length === 0) {
        throw new ParseError("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
      }
      var undefs = this.undefStack.pop();
      for (var undef in undefs) {
        if (undefs.hasOwnProperty(undef)) {
          if (undefs[undef] == null) {
            delete this.current[undef];
          } else {
            this.current[undef] = undefs[undef];
          }
        }
      }
    }
    /**
     * Ends all currently nested groups (if any), restoring values before the
     * groups began.  Useful in case of an error in the middle of parsing.
     */
    endGroups() {
      while (this.undefStack.length > 0) {
        this.endGroup();
      }
    }
    /**
     * Detect whether `name` has a definition.  Equivalent to
     * `get(name) != null`.
     */
    has(name) {
      return this.current.hasOwnProperty(name) || this.builtins.hasOwnProperty(name);
    }
    /**
     * Get the current value of a name, or `undefined` if there is no value.
     *
     * Note: Do not use `if (namespace.get(...))` to detect whether a macro
     * is defined, as the definition may be the empty string which evaluates
     * to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
     * `if (namespace.has(...))`.
     */
    get(name) {
      if (this.current.hasOwnProperty(name)) {
        return this.current[name];
      } else {
        return this.builtins[name];
      }
    }
    /**
     * Set the current value of a name, and optionally set it globally too.
     * Local set() sets the current value and (when appropriate) adds an undo
     * operation to the undo stack.  Global set() may change the undo
     * operation at every level, so takes time linear in their number.
     * A value of undefined means to delete existing definitions.
     */
    set(name, value, global) {
      if (global === void 0) {
        global = false;
      }
      if (global) {
        for (var i = 0; i < this.undefStack.length; i++) {
          delete this.undefStack[i][name];
        }
        if (this.undefStack.length > 0) {
          this.undefStack[this.undefStack.length - 1][name] = value;
        }
      } else {
        var top = this.undefStack[this.undefStack.length - 1];
        if (top && !top.hasOwnProperty(name)) {
          top[name] = this.current[name];
        }
      }
      if (value == null) {
        delete this.current[name];
      } else {
        this.current[name] = value;
      }
    }
  };
  var macros = _macros;
  defineMacro("\\noexpand", function(context) {
    var t = context.popToken();
    if (context.isExpandable(t.text)) {
      t.noexpand = true;
      t.treatAsRelax = true;
    }
    return {
      tokens: [t],
      numArgs: 0
    };
  });
  defineMacro("\\expandafter", function(context) {
    var t = context.popToken();
    context.expandOnce(true);
    return {
      tokens: [t],
      numArgs: 0
    };
  });
  defineMacro("\\@firstoftwo", function(context) {
    var args = context.consumeArgs(2);
    return {
      tokens: args[0],
      numArgs: 0
    };
  });
  defineMacro("\\@secondoftwo", function(context) {
    var args = context.consumeArgs(2);
    return {
      tokens: args[1],
      numArgs: 0
    };
  });
  defineMacro("\\@ifnextchar", function(context) {
    var args = context.consumeArgs(3);
    context.consumeSpaces();
    var nextToken = context.future();
    if (args[0].length === 1 && args[0][0].text === nextToken.text) {
      return {
        tokens: args[1],
        numArgs: 0
      };
    } else {
      return {
        tokens: args[2],
        numArgs: 0
      };
    }
  });
  defineMacro("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
  defineMacro("\\TextOrMath", function(context) {
    var args = context.consumeArgs(2);
    if (context.mode === "text") {
      return {
        tokens: args[0],
        numArgs: 0
      };
    } else {
      return {
        tokens: args[1],
        numArgs: 0
      };
    }
  });
  var digitToNumber = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "a": 10,
    "A": 10,
    "b": 11,
    "B": 11,
    "c": 12,
    "C": 12,
    "d": 13,
    "D": 13,
    "e": 14,
    "E": 14,
    "f": 15,
    "F": 15
  };
  defineMacro("\\char", function(context) {
    var token = context.popToken();
    var base;
    var number = 0;
    if (token.text === "'") {
      base = 8;
      token = context.popToken();
    } else if (token.text === '"') {
      base = 16;
      token = context.popToken();
    } else if (token.text === "`") {
      token = context.popToken();
      if (token.text[0] === "\\") {
        number = token.text.charCodeAt(1);
      } else if (token.text === "EOF") {
        throw new ParseError("\\char` missing argument");
      } else {
        number = token.text.charCodeAt(0);
      }
    } else {
      base = 10;
    }
    if (base) {
      number = digitToNumber[token.text];
      if (number == null || number >= base) {
        throw new ParseError("Invalid base-" + base + " digit " + token.text);
      }
      var digit;
      while ((digit = digitToNumber[context.future().text]) != null && digit < base) {
        number *= base;
        number += digit;
        context.popToken();
      }
    }
    return "\\@char{" + number + "}";
  });
  var newcommand = (context, existsOK, nonexistsOK, skipIfExists) => {
    var arg = context.consumeArg().tokens;
    if (arg.length !== 1) {
      throw new ParseError("\\newcommand's first argument must be a macro name");
    }
    var name = arg[0].text;
    var exists = context.isDefined(name);
    if (exists && !existsOK) {
      throw new ParseError("\\newcommand{" + name + "} attempting to redefine " + (name + "; use \\renewcommand"));
    }
    if (!exists && !nonexistsOK) {
      throw new ParseError("\\renewcommand{" + name + "} when command " + name + " does not yet exist; use \\newcommand");
    }
    var numArgs = 0;
    arg = context.consumeArg().tokens;
    if (arg.length === 1 && arg[0].text === "[") {
      var argText = "";
      var token = context.expandNextToken();
      while (token.text !== "]" && token.text !== "EOF") {
        argText += token.text;
        token = context.expandNextToken();
      }
      if (!argText.match(/^\s*[0-9]+\s*$/)) {
        throw new ParseError("Invalid number of arguments: " + argText);
      }
      numArgs = parseInt(argText);
      arg = context.consumeArg().tokens;
    }
    if (!(exists && skipIfExists)) {
      context.macros.set(name, {
        tokens: arg,
        numArgs
      });
    }
    return "";
  };
  defineMacro("\\newcommand", (context) => newcommand(context, false, true, false));
  defineMacro("\\renewcommand", (context) => newcommand(context, true, false, false));
  defineMacro("\\providecommand", (context) => newcommand(context, true, true, true));
  defineMacro("\\message", (context) => {
    var arg = context.consumeArgs(1)[0];
    console.log(arg.reverse().map((token) => token.text).join(""));
    return "";
  });
  defineMacro("\\errmessage", (context) => {
    var arg = context.consumeArgs(1)[0];
    console.error(arg.reverse().map((token) => token.text).join(""));
    return "";
  });
  defineMacro("\\show", (context) => {
    var tok = context.popToken();
    var name = tok.text;
    console.log(tok, context.macros.get(name), functions[name], symbols.math[name], symbols.text[name]);
    return "";
  });
  defineMacro("\\bgroup", "{");
  defineMacro("\\egroup", "}");
  defineMacro("~", "\\nobreakspace");
  defineMacro("\\lq", "`");
  defineMacro("\\rq", "'");
  defineMacro("\\aa", "\\r a");
  defineMacro("\\AA", "\\r A");
  defineMacro("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`\xA9}");
  defineMacro("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
  defineMacro("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xAE}");
  defineMacro("\u212C", "\\mathscr{B}");
  defineMacro("\u2130", "\\mathscr{E}");
  defineMacro("\u2131", "\\mathscr{F}");
  defineMacro("\u210B", "\\mathscr{H}");
  defineMacro("\u2110", "\\mathscr{I}");
  defineMacro("\u2112", "\\mathscr{L}");
  defineMacro("\u2133", "\\mathscr{M}");
  defineMacro("\u211B", "\\mathscr{R}");
  defineMacro("\u212D", "\\mathfrak{C}");
  defineMacro("\u210C", "\\mathfrak{H}");
  defineMacro("\u2128", "\\mathfrak{Z}");
  defineMacro("\\Bbbk", "\\Bbb{k}");
  defineMacro("\\llap", "\\mathllap{\\textrm{#1}}");
  defineMacro("\\rlap", "\\mathrlap{\\textrm{#1}}");
  defineMacro("\\clap", "\\mathclap{\\textrm{#1}}");
  defineMacro("\\mathstrut", "\\vphantom{(}");
  defineMacro("\\underbar", "\\underline{\\text{#1}}");
  defineMacro("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}');
  defineMacro("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}");
  defineMacro("\\ne", "\\neq");
  defineMacro("\u2260", "\\neq");
  defineMacro("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}");
  defineMacro("\u2209", "\\notin");
  defineMacro("\u2258", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}");
  defineMacro("\u2259", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}");
  defineMacro("\u225A", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225A}}");
  defineMacro("\u225B", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225B}}");
  defineMacro("\u225D", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225D}}");
  defineMacro("\u225E", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225E}}");
  defineMacro("\u225F", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225F}}");
  defineMacro("\u27C2", "\\perp");
  defineMacro("\u203C", "\\mathclose{!\\mkern-0.8mu!}");
  defineMacro("\u220C", "\\notni");
  defineMacro("\u231C", "\\ulcorner");
  defineMacro("\u231D", "\\urcorner");
  defineMacro("\u231E", "\\llcorner");
  defineMacro("\u231F", "\\lrcorner");
  defineMacro("\xA9", "\\copyright");
  defineMacro("\xAE", "\\textregistered");
  defineMacro("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
  defineMacro("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
  defineMacro("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
  defineMacro("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
  defineMacro("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
  defineMacro("\u22EE", "\\vdots");
  defineMacro("\\varGamma", "\\mathit{\\Gamma}");
  defineMacro("\\varDelta", "\\mathit{\\Delta}");
  defineMacro("\\varTheta", "\\mathit{\\Theta}");
  defineMacro("\\varLambda", "\\mathit{\\Lambda}");
  defineMacro("\\varXi", "\\mathit{\\Xi}");
  defineMacro("\\varPi", "\\mathit{\\Pi}");
  defineMacro("\\varSigma", "\\mathit{\\Sigma}");
  defineMacro("\\varUpsilon", "\\mathit{\\Upsilon}");
  defineMacro("\\varPhi", "\\mathit{\\Phi}");
  defineMacro("\\varPsi", "\\mathit{\\Psi}");
  defineMacro("\\varOmega", "\\mathit{\\Omega}");
  defineMacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
  defineMacro("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
  defineMacro("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
  defineMacro("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
  defineMacro("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
  defineMacro("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
  defineMacro("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
  defineMacro("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
  var dotsByToken = {
    ",": "\\dotsc",
    "\\not": "\\dotsb",
    // \keybin@ checks for the following:
    "+": "\\dotsb",
    "=": "\\dotsb",
    "<": "\\dotsb",
    ">": "\\dotsb",
    "-": "\\dotsb",
    "*": "\\dotsb",
    ":": "\\dotsb",
    // Symbols whose definition starts with \DOTSB:
    "\\DOTSB": "\\dotsb",
    "\\coprod": "\\dotsb",
    "\\bigvee": "\\dotsb",
    "\\bigwedge": "\\dotsb",
    "\\biguplus": "\\dotsb",
    "\\bigcap": "\\dotsb",
    "\\bigcup": "\\dotsb",
    "\\prod": "\\dotsb",
    "\\sum": "\\dotsb",
    "\\bigotimes": "\\dotsb",
    "\\bigoplus": "\\dotsb",
    "\\bigodot": "\\dotsb",
    "\\bigsqcup": "\\dotsb",
    "\\And": "\\dotsb",
    "\\longrightarrow": "\\dotsb",
    "\\Longrightarrow": "\\dotsb",
    "\\longleftarrow": "\\dotsb",
    "\\Longleftarrow": "\\dotsb",
    "\\longleftrightarrow": "\\dotsb",
    "\\Longleftrightarrow": "\\dotsb",
    "\\mapsto": "\\dotsb",
    "\\longmapsto": "\\dotsb",
    "\\hookrightarrow": "\\dotsb",
    "\\doteq": "\\dotsb",
    // Symbols whose definition starts with \mathbin:
    "\\mathbin": "\\dotsb",
    // Symbols whose definition starts with \mathrel:
    "\\mathrel": "\\dotsb",
    "\\relbar": "\\dotsb",
    "\\Relbar": "\\dotsb",
    "\\xrightarrow": "\\dotsb",
    "\\xleftarrow": "\\dotsb",
    // Symbols whose definition starts with \DOTSI:
    "\\DOTSI": "\\dotsi",
    "\\int": "\\dotsi",
    "\\oint": "\\dotsi",
    "\\iint": "\\dotsi",
    "\\iiint": "\\dotsi",
    "\\iiiint": "\\dotsi",
    "\\idotsint": "\\dotsi",
    // Symbols whose definition starts with \DOTSX:
    "\\DOTSX": "\\dotsx"
  };
  var dotsbGroups = /* @__PURE__ */ new Set(["bin", "rel"]);
  defineMacro("\\dots", function(context) {
    var thedots = "\\dotso";
    var next = context.expandAfterFuture().text;
    if (next in dotsByToken) {
      thedots = dotsByToken[next];
    } else if (next.slice(0, 4) === "\\not") {
      thedots = "\\dotsb";
    } else if (next in symbols.math) {
      if (dotsbGroups.has(symbols.math[next].group)) {
        thedots = "\\dotsb";
      }
    }
    return thedots;
  });
  var spaceAfterDots = {
    // \rightdelim@ checks for the following:
    ")": true,
    "]": true,
    "\\rbrack": true,
    "\\}": true,
    "\\rbrace": true,
    "\\rangle": true,
    "\\rceil": true,
    "\\rfloor": true,
    "\\rgroup": true,
    "\\rmoustache": true,
    "\\right": true,
    "\\bigr": true,
    "\\biggr": true,
    "\\Bigr": true,
    "\\Biggr": true,
    // \extra@ also tests for the following:
    "$": true,
    // \extrap@ checks for the following:
    ";": true,
    ".": true,
    ",": true
  };
  defineMacro("\\dotso", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots) {
      return "\\ldots\\,";
    } else {
      return "\\ldots";
    }
  });
  defineMacro("\\dotsc", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots && next !== ",") {
      return "\\ldots\\,";
    } else {
      return "\\ldots";
    }
  });
  defineMacro("\\cdots", function(context) {
    var next = context.future().text;
    if (next in spaceAfterDots) {
      return "\\@cdots\\,";
    } else {
      return "\\@cdots";
    }
  });
  defineMacro("\\dotsb", "\\cdots");
  defineMacro("\\dotsm", "\\cdots");
  defineMacro("\\dotsi", "\\!\\cdots");
  defineMacro("\\dotsx", "\\ldots\\,");
  defineMacro("\\DOTSI", "\\relax");
  defineMacro("\\DOTSB", "\\relax");
  defineMacro("\\DOTSX", "\\relax");
  defineMacro("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
  defineMacro("\\,", "\\tmspace+{3mu}{.1667em}");
  defineMacro("\\thinspace", "\\,");
  defineMacro("\\>", "\\mskip{4mu}");
  defineMacro("\\:", "\\tmspace+{4mu}{.2222em}");
  defineMacro("\\medspace", "\\:");
  defineMacro("\\;", "\\tmspace+{5mu}{.2777em}");
  defineMacro("\\thickspace", "\\;");
  defineMacro("\\!", "\\tmspace-{3mu}{.1667em}");
  defineMacro("\\negthinspace", "\\!");
  defineMacro("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
  defineMacro("\\negthickspace", "\\tmspace-{5mu}{.277em}");
  defineMacro("\\enspace", "\\kern.5em ");
  defineMacro("\\enskip", "\\hskip.5em\\relax");
  defineMacro("\\quad", "\\hskip1em\\relax");
  defineMacro("\\qquad", "\\hskip2em\\relax");
  defineMacro("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
  defineMacro("\\tag@paren", "\\tag@literal{({#1})}");
  defineMacro("\\tag@literal", (context) => {
    if (context.macros.get("\\df@tag")) {
      throw new ParseError("Multiple \\tag");
    }
    return "\\gdef\\df@tag{\\text{#1}}";
  });
  defineMacro("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
  defineMacro("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
  defineMacro("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
  defineMacro("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
  defineMacro("\\newline", "\\\\\\relax");
  defineMacro("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
  var latexRaiseA = makeEm(fontMetricsData["Main-Regular"]["T".charCodeAt(0)][1] - 0.7 * fontMetricsData["Main-Regular"]["A".charCodeAt(0)][1]);
  defineMacro("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
  defineMacro("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
  defineMacro("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
  defineMacro("\\@hspace", "\\hskip #1\\relax");
  defineMacro("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
  defineMacro("\\ordinarycolon", ":");
  defineMacro("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
  defineMacro("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');
  defineMacro("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');
  defineMacro("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');
  defineMacro("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');
  defineMacro("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');
  defineMacro("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');
  defineMacro("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');
  defineMacro("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');
  defineMacro("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');
  defineMacro("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');
  defineMacro("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');
  defineMacro("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');
  defineMacro("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');
  defineMacro("\u2237", "\\dblcolon");
  defineMacro("\u2239", "\\eqcolon");
  defineMacro("\u2254", "\\coloneqq");
  defineMacro("\u2255", "\\eqqcolon");
  defineMacro("\u2A74", "\\Coloneqq");
  defineMacro("\\ratio", "\\vcentcolon");
  defineMacro("\\coloncolon", "\\dblcolon");
  defineMacro("\\colonequals", "\\coloneqq");
  defineMacro("\\coloncolonequals", "\\Coloneqq");
  defineMacro("\\equalscolon", "\\eqqcolon");
  defineMacro("\\equalscoloncolon", "\\Eqqcolon");
  defineMacro("\\colonminus", "\\coloneq");
  defineMacro("\\coloncolonminus", "\\Coloneq");
  defineMacro("\\minuscolon", "\\eqcolon");
  defineMacro("\\minuscoloncolon", "\\Eqcolon");
  defineMacro("\\coloncolonapprox", "\\Colonapprox");
  defineMacro("\\coloncolonsim", "\\Colonsim");
  defineMacro("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
  defineMacro("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
  defineMacro("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
  defineMacro("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
  defineMacro("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220C}}");
  defineMacro("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
  defineMacro("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
  defineMacro("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
  defineMacro("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
  defineMacro("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
  defineMacro("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
  defineMacro("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
  defineMacro("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
  defineMacro("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{\u2269}");
  defineMacro("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{\u2268}");
  defineMacro("\\ngeqq", "\\html@mathml{\\@ngeqq}{\u2271}");
  defineMacro("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{\u2271}");
  defineMacro("\\nleqq", "\\html@mathml{\\@nleqq}{\u2270}");
  defineMacro("\\nleqslant", "\\html@mathml{\\@nleqslant}{\u2270}");
  defineMacro("\\nshortmid", "\\html@mathml{\\@nshortmid}{\u2224}");
  defineMacro("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{\u2226}");
  defineMacro("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{\u2288}");
  defineMacro("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{\u2289}");
  defineMacro("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{\u228A}");
  defineMacro("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{\u2ACB}");
  defineMacro("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{\u228B}");
  defineMacro("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{\u2ACC}");
  defineMacro("\\imath", "\\html@mathml{\\@imath}{\u0131}");
  defineMacro("\\jmath", "\\html@mathml{\\@jmath}{\u0237}");
  defineMacro("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`\u27E6}}");
  defineMacro("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`\u27E7}}");
  defineMacro("\u27E6", "\\llbracket");
  defineMacro("\u27E7", "\\rrbracket");
  defineMacro("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`\u2983}}");
  defineMacro("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`\u2984}}");
  defineMacro("\u2983", "\\lBrace");
  defineMacro("\u2984", "\\rBrace");
  defineMacro("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`\u29B5}}");
  defineMacro("\u29B5", "\\minuso");
  defineMacro("\\darr", "\\downarrow");
  defineMacro("\\dArr", "\\Downarrow");
  defineMacro("\\Darr", "\\Downarrow");
  defineMacro("\\lang", "\\langle");
  defineMacro("\\rang", "\\rangle");
  defineMacro("\\uarr", "\\uparrow");
  defineMacro("\\uArr", "\\Uparrow");
  defineMacro("\\Uarr", "\\Uparrow");
  defineMacro("\\N", "\\mathbb{N}");
  defineMacro("\\R", "\\mathbb{R}");
  defineMacro("\\Z", "\\mathbb{Z}");
  defineMacro("\\alef", "\\aleph");
  defineMacro("\\alefsym", "\\aleph");
  defineMacro("\\Alpha", "\\mathrm{A}");
  defineMacro("\\Beta", "\\mathrm{B}");
  defineMacro("\\bull", "\\bullet");
  defineMacro("\\Chi", "\\mathrm{X}");
  defineMacro("\\clubs", "\\clubsuit");
  defineMacro("\\cnums", "\\mathbb{C}");
  defineMacro("\\Complex", "\\mathbb{C}");
  defineMacro("\\Dagger", "\\ddagger");
  defineMacro("\\diamonds", "\\diamondsuit");
  defineMacro("\\empty", "\\emptyset");
  defineMacro("\\Epsilon", "\\mathrm{E}");
  defineMacro("\\Eta", "\\mathrm{H}");
  defineMacro("\\exist", "\\exists");
  defineMacro("\\harr", "\\leftrightarrow");
  defineMacro("\\hArr", "\\Leftrightarrow");
  defineMacro("\\Harr", "\\Leftrightarrow");
  defineMacro("\\hearts", "\\heartsuit");
  defineMacro("\\image", "\\Im");
  defineMacro("\\infin", "\\infty");
  defineMacro("\\Iota", "\\mathrm{I}");
  defineMacro("\\isin", "\\in");
  defineMacro("\\Kappa", "\\mathrm{K}");
  defineMacro("\\larr", "\\leftarrow");
  defineMacro("\\lArr", "\\Leftarrow");
  defineMacro("\\Larr", "\\Leftarrow");
  defineMacro("\\lrarr", "\\leftrightarrow");
  defineMacro("\\lrArr", "\\Leftrightarrow");
  defineMacro("\\Lrarr", "\\Leftrightarrow");
  defineMacro("\\Mu", "\\mathrm{M}");
  defineMacro("\\natnums", "\\mathbb{N}");
  defineMacro("\\Nu", "\\mathrm{N}");
  defineMacro("\\Omicron", "\\mathrm{O}");
  defineMacro("\\plusmn", "\\pm");
  defineMacro("\\rarr", "\\rightarrow");
  defineMacro("\\rArr", "\\Rightarrow");
  defineMacro("\\Rarr", "\\Rightarrow");
  defineMacro("\\real", "\\Re");
  defineMacro("\\reals", "\\mathbb{R}");
  defineMacro("\\Reals", "\\mathbb{R}");
  defineMacro("\\Rho", "\\mathrm{P}");
  defineMacro("\\sdot", "\\cdot");
  defineMacro("\\sect", "\\S");
  defineMacro("\\spades", "\\spadesuit");
  defineMacro("\\sub", "\\subset");
  defineMacro("\\sube", "\\subseteq");
  defineMacro("\\supe", "\\supseteq");
  defineMacro("\\Tau", "\\mathrm{T}");
  defineMacro("\\thetasym", "\\vartheta");
  defineMacro("\\weierp", "\\wp");
  defineMacro("\\Zeta", "\\mathrm{Z}");
  defineMacro("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
  defineMacro("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
  defineMacro("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
  defineMacro("\\bra", "\\mathinner{\\langle{#1}|}");
  defineMacro("\\ket", "\\mathinner{|{#1}\\rangle}");
  defineMacro("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
  defineMacro("\\Bra", "\\left\\langle#1\\right|");
  defineMacro("\\Ket", "\\left|#1\\right\\rangle");
  var braketHelper = (one) => (context) => {
    var left = context.consumeArg().tokens;
    var middle = context.consumeArg().tokens;
    var middleDouble = context.consumeArg().tokens;
    var right = context.consumeArg().tokens;
    var oldMiddle = context.macros.get("|");
    var oldMiddleDouble = context.macros.get("\\|");
    context.macros.beginGroup();
    var midMacro = (double) => (context2) => {
      if (one) {
        context2.macros.set("|", oldMiddle);
        if (middleDouble.length) {
          context2.macros.set("\\|", oldMiddleDouble);
        }
      }
      var doubled = double;
      if (!double && middleDouble.length) {
        var nextToken = context2.future();
        if (nextToken.text === "|") {
          context2.popToken();
          doubled = true;
        }
      }
      return {
        tokens: doubled ? middleDouble : middle,
        numArgs: 0
      };
    };
    context.macros.set("|", midMacro(false));
    if (middleDouble.length) {
      context.macros.set("\\|", midMacro(true));
    }
    var arg = context.consumeArg().tokens;
    var expanded = context.expandTokens([
      ...right,
      ...arg,
      ...left
      // reversed
    ]);
    context.macros.endGroup();
    return {
      tokens: expanded.reverse(),
      numArgs: 0
    };
  };
  defineMacro("\\bra@ket", braketHelper(false));
  defineMacro("\\bra@set", braketHelper(true));
  defineMacro("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
  defineMacro("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
  defineMacro("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
  defineMacro("\\angln", "{\\angl n}");
  defineMacro("\\blue", "\\textcolor{##6495ed}{#1}");
  defineMacro("\\orange", "\\textcolor{##ffa500}{#1}");
  defineMacro("\\pink", "\\textcolor{##ff00af}{#1}");
  defineMacro("\\red", "\\textcolor{##df0030}{#1}");
  defineMacro("\\green", "\\textcolor{##28ae7b}{#1}");
  defineMacro("\\gray", "\\textcolor{gray}{#1}");
  defineMacro("\\purple", "\\textcolor{##9d38bd}{#1}");
  defineMacro("\\blueA", "\\textcolor{##ccfaff}{#1}");
  defineMacro("\\blueB", "\\textcolor{##80f6ff}{#1}");
  defineMacro("\\blueC", "\\textcolor{##63d9ea}{#1}");
  defineMacro("\\blueD", "\\textcolor{##11accd}{#1}");
  defineMacro("\\blueE", "\\textcolor{##0c7f99}{#1}");
  defineMacro("\\tealA", "\\textcolor{##94fff5}{#1}");
  defineMacro("\\tealB", "\\textcolor{##26edd5}{#1}");
  defineMacro("\\tealC", "\\textcolor{##01d1c1}{#1}");
  defineMacro("\\tealD", "\\textcolor{##01a995}{#1}");
  defineMacro("\\tealE", "\\textcolor{##208170}{#1}");
  defineMacro("\\greenA", "\\textcolor{##b6ffb0}{#1}");
  defineMacro("\\greenB", "\\textcolor{##8af281}{#1}");
  defineMacro("\\greenC", "\\textcolor{##74cf70}{#1}");
  defineMacro("\\greenD", "\\textcolor{##1fab54}{#1}");
  defineMacro("\\greenE", "\\textcolor{##0d923f}{#1}");
  defineMacro("\\goldA", "\\textcolor{##ffd0a9}{#1}");
  defineMacro("\\goldB", "\\textcolor{##ffbb71}{#1}");
  defineMacro("\\goldC", "\\textcolor{##ff9c39}{#1}");
  defineMacro("\\goldD", "\\textcolor{##e07d10}{#1}");
  defineMacro("\\goldE", "\\textcolor{##a75a05}{#1}");
  defineMacro("\\redA", "\\textcolor{##fca9a9}{#1}");
  defineMacro("\\redB", "\\textcolor{##ff8482}{#1}");
  defineMacro("\\redC", "\\textcolor{##f9685d}{#1}");
  defineMacro("\\redD", "\\textcolor{##e84d39}{#1}");
  defineMacro("\\redE", "\\textcolor{##bc2612}{#1}");
  defineMacro("\\maroonA", "\\textcolor{##ffbde0}{#1}");
  defineMacro("\\maroonB", "\\textcolor{##ff92c6}{#1}");
  defineMacro("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
  defineMacro("\\maroonD", "\\textcolor{##ca337c}{#1}");
  defineMacro("\\maroonE", "\\textcolor{##9e034e}{#1}");
  defineMacro("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
  defineMacro("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
  defineMacro("\\purpleC", "\\textcolor{##aa87ff}{#1}");
  defineMacro("\\purpleD", "\\textcolor{##7854ab}{#1}");
  defineMacro("\\purpleE", "\\textcolor{##543b78}{#1}");
  defineMacro("\\mintA", "\\textcolor{##f5f9e8}{#1}");
  defineMacro("\\mintB", "\\textcolor{##edf2df}{#1}");
  defineMacro("\\mintC", "\\textcolor{##e0e5cc}{#1}");
  defineMacro("\\grayA", "\\textcolor{##f6f7f7}{#1}");
  defineMacro("\\grayB", "\\textcolor{##f0f1f2}{#1}");
  defineMacro("\\grayC", "\\textcolor{##e3e5e6}{#1}");
  defineMacro("\\grayD", "\\textcolor{##d6d8da}{#1}");
  defineMacro("\\grayE", "\\textcolor{##babec2}{#1}");
  defineMacro("\\grayF", "\\textcolor{##888d93}{#1}");
  defineMacro("\\grayG", "\\textcolor{##626569}{#1}");
  defineMacro("\\grayH", "\\textcolor{##3b3e40}{#1}");
  defineMacro("\\grayI", "\\textcolor{##21242c}{#1}");
  defineMacro("\\kaBlue", "\\textcolor{##314453}{#1}");
  defineMacro("\\kaGreen", "\\textcolor{##71B307}{#1}");
  var implicitCommands = {
    "^": true,
    // Parser.js
    "_": true,
    // Parser.js
    "\\limits": true,
    // Parser.js
    "\\nolimits": true
    // Parser.js
  };
  var MacroExpander = class {
    constructor(input, settings, mode) {
      this.settings = void 0;
      this.expansionCount = void 0;
      this.lexer = void 0;
      this.macros = void 0;
      this.stack = void 0;
      this.mode = void 0;
      this.settings = settings;
      this.expansionCount = 0;
      this.feed(input);
      this.macros = new Namespace(macros, settings.macros);
      this.mode = mode;
      this.stack = [];
    }
    /**
     * Feed a new input string to the same MacroExpander
     * (with existing macros etc.).
     */
    feed(input) {
      this.lexer = new Lexer(input, this.settings);
    }
    /**
     * Switches between "text" and "math" modes.
     */
    switchMode(newMode) {
      this.mode = newMode;
    }
    /**
     * Start a new group nesting within all namespaces.
     */
    beginGroup() {
      this.macros.beginGroup();
    }
    /**
     * End current group nesting within all namespaces.
     */
    endGroup() {
      this.macros.endGroup();
    }
    /**
     * Ends all currently nested groups (if any), restoring values before the
     * groups began.  Useful in case of an error in the middle of parsing.
     */
    endGroups() {
      this.macros.endGroups();
    }
    /**
     * Returns the topmost token on the stack, without expanding it.
     * Similar in behavior to TeX's `\futurelet`.
     */
    future() {
      if (this.stack.length === 0) {
        this.pushToken(this.lexer.lex());
      }
      return this.stack[this.stack.length - 1];
    }
    /**
     * Remove and return the next unexpanded token.
     */
    popToken() {
      this.future();
      return this.stack.pop();
    }
    /**
     * Add a given token to the token stack.  In particular, this get be used
     * to put back a token returned from one of the other methods.
     */
    pushToken(token) {
      this.stack.push(token);
    }
    /**
     * Append an array of tokens to the token stack.
     */
    pushTokens(tokens) {
      this.stack.push(...tokens);
    }
    /**
     * Find an macro argument without expanding tokens and append the array of
     * tokens to the token stack. Uses Token as a container for the result.
     */
    scanArgument(isOptional) {
      var start;
      var end;
      var tokens;
      if (isOptional) {
        this.consumeSpaces();
        if (this.future().text !== "[") {
          return null;
        }
        start = this.popToken();
        ({
          tokens,
          end
        } = this.consumeArg(["]"]));
      } else {
        ({
          tokens,
          start,
          end
        } = this.consumeArg());
      }
      this.pushToken(new Token("EOF", end.loc));
      this.pushTokens(tokens);
      return new Token("", SourceLocation.range(start, end));
    }
    /**
     * Consume all following space tokens, without expansion.
     */
    consumeSpaces() {
      for (; ; ) {
        var token = this.future();
        if (token.text === " ") {
          this.stack.pop();
        } else {
          break;
        }
      }
    }
    /**
     * Consume an argument from the token stream, and return the resulting array
     * of tokens and start/end token.
     */
    consumeArg(delims) {
      var tokens = [];
      var isDelimited = delims && delims.length > 0;
      if (!isDelimited) {
        this.consumeSpaces();
      }
      var start = this.future();
      var tok;
      var depth = 0;
      var match = 0;
      do {
        tok = this.popToken();
        tokens.push(tok);
        if (tok.text === "{") {
          ++depth;
        } else if (tok.text === "}") {
          --depth;
          if (depth === -1) {
            throw new ParseError("Extra }", tok);
          }
        } else if (tok.text === "EOF") {
          throw new ParseError("Unexpected end of input in a macro argument, expected '" + (delims && isDelimited ? delims[match] : "}") + "'", tok);
        }
        if (delims && isDelimited) {
          if ((depth === 0 || depth === 1 && delims[match] === "{") && tok.text === delims[match]) {
            ++match;
            if (match === delims.length) {
              tokens.splice(-match, match);
              break;
            }
          } else {
            match = 0;
          }
        }
      } while (depth !== 0 || isDelimited);
      if (start.text === "{" && tokens[tokens.length - 1].text === "}") {
        tokens.pop();
        tokens.shift();
      }
      tokens.reverse();
      return {
        tokens,
        start,
        end: tok
      };
    }
    /**
     * Consume the specified number of (delimited) arguments from the token
     * stream and return the resulting array of arguments.
     */
    consumeArgs(numArgs, delimiters2) {
      if (delimiters2) {
        if (delimiters2.length !== numArgs + 1) {
          throw new ParseError("The length of delimiters doesn't match the number of args!");
        }
        var delims = delimiters2[0];
        for (var i = 0; i < delims.length; i++) {
          var tok = this.popToken();
          if (delims[i] !== tok.text) {
            throw new ParseError("Use of the macro doesn't match its definition", tok);
          }
        }
      }
      var args = [];
      for (var _i = 0; _i < numArgs; _i++) {
        args.push(this.consumeArg(delimiters2 && delimiters2[_i + 1]).tokens);
      }
      return args;
    }
    /**
     * Increment `expansionCount` by the specified amount.
     * Throw an error if it exceeds `maxExpand`.
     */
    countExpansion(amount) {
      this.expansionCount += amount;
      if (this.expansionCount > this.settings.maxExpand) {
        throw new ParseError("Too many expansions: infinite loop or need to increase maxExpand setting");
      }
    }
    /**
     * Expand the next token only once if possible.
     *
     * If the token is expanded, the resulting tokens will be pushed onto
     * the stack in reverse order, and the number of such tokens will be
     * returned.  This number might be zero or positive.
     *
     * If not, the return value is `false`, and the next token remains at the
     * top of the stack.
     *
     * In either case, the next token will be on the top of the stack,
     * or the stack will be empty (in case of empty expansion
     * and no other tokens).
     *
     * Used to implement `expandAfterFuture` and `expandNextToken`.
     *
     * If expandableOnly, only expandable tokens are expanded and
     * an undefined control sequence results in an error.
     */
    expandOnce(expandableOnly) {
      var topToken = this.popToken();
      var name = topToken.text;
      var expansion = !topToken.noexpand ? this._getExpansion(name) : null;
      if (expansion == null || expandableOnly && expansion.unexpandable) {
        if (expandableOnly && expansion == null && name[0] === "\\" && !this.isDefined(name)) {
          throw new ParseError("Undefined control sequence: " + name);
        }
        this.pushToken(topToken);
        return false;
      }
      this.countExpansion(1);
      var tokens = expansion.tokens;
      var args = this.consumeArgs(expansion.numArgs, expansion.delimiters);
      if (expansion.numArgs) {
        tokens = tokens.slice();
        for (var i = tokens.length - 1; i >= 0; --i) {
          var tok = tokens[i];
          if (tok.text === "#") {
            if (i === 0) {
              throw new ParseError("Incomplete placeholder at end of macro body", tok);
            }
            tok = tokens[--i];
            if (tok.text === "#") {
              tokens.splice(i + 1, 1);
            } else if (/^[1-9]$/.test(tok.text)) {
              tokens.splice(i, 2, ...args[+tok.text - 1]);
            } else {
              throw new ParseError("Not a valid argument number", tok);
            }
          }
        }
      }
      this.pushTokens(tokens);
      return tokens.length;
    }
    /**
     * Expand the next token only once (if possible), and return the resulting
     * top token on the stack (without removing anything from the stack).
     * Similar in behavior to TeX's `\expandafter\futurelet`.
     * Equivalent to expandOnce() followed by future().
     */
    expandAfterFuture() {
      this.expandOnce();
      return this.future();
    }
    /**
     * Recursively expand first token, then return first non-expandable token.
     */
    expandNextToken() {
      for (; ; ) {
        if (this.expandOnce() === false) {
          var token = this.stack.pop();
          if (token.treatAsRelax) {
            token.text = "\\relax";
          }
          return token;
        }
      }
    }
    /**
     * Fully expand the given macro name and return the resulting list of
     * tokens, or return `undefined` if no such macro is defined.
     */
    expandMacro(name) {
      return this.macros.has(name) ? this.expandTokens([new Token(name)]) : void 0;
    }
    /**
     * Fully expand the given token stream and return the resulting list of
     * tokens.  Note that the input tokens are in reverse order, but the
     * output tokens are in forward order.
     */
    expandTokens(tokens) {
      var output = [];
      var oldStackLength = this.stack.length;
      this.pushTokens(tokens);
      while (this.stack.length > oldStackLength) {
        if (this.expandOnce(true) === false) {
          var token = this.stack.pop();
          if (token.treatAsRelax) {
            token.noexpand = false;
            token.treatAsRelax = false;
          }
          output.push(token);
        }
      }
      this.countExpansion(output.length);
      return output;
    }
    /**
     * Fully expand the given macro name and return the result as a string,
     * or return `undefined` if no such macro is defined.
     */
    expandMacroAsText(name) {
      var tokens = this.expandMacro(name);
      if (tokens) {
        return tokens.map((token) => token.text).join("");
      } else {
        return tokens;
      }
    }
    /**
     * Returns the expanded macro as a reversed array of tokens and a macro
     * argument count.  Or returns `null` if no such macro.
     */
    _getExpansion(name) {
      var definition2 = this.macros.get(name);
      if (definition2 == null) {
        return definition2;
      }
      if (name.length === 1) {
        var catcode = this.lexer.catcodes[name];
        if (catcode != null && catcode !== 13) {
          return;
        }
      }
      var expansion = typeof definition2 === "function" ? definition2(this) : definition2;
      if (typeof expansion === "string") {
        var numArgs = 0;
        if (expansion.includes("#")) {
          var stripped = expansion.replace(/##/g, "");
          while (stripped.includes("#" + (numArgs + 1))) {
            ++numArgs;
          }
        }
        var bodyLexer = new Lexer(expansion, this.settings);
        var tokens = [];
        var tok = bodyLexer.lex();
        while (tok.text !== "EOF") {
          tokens.push(tok);
          tok = bodyLexer.lex();
        }
        tokens.reverse();
        var expanded = {
          tokens,
          numArgs
        };
        return expanded;
      }
      return expansion;
    }
    /**
     * Determine whether a command is currently "defined" (has some
     * functionality), meaning that it's a macro (in the current group),
     * a function, a symbol, or one of the special commands listed in
     * `implicitCommands`.
     */
    isDefined(name) {
      return this.macros.has(name) || functions.hasOwnProperty(name) || symbols.math.hasOwnProperty(name) || symbols.text.hasOwnProperty(name) || implicitCommands.hasOwnProperty(name);
    }
    /**
     * Determine whether a command is expandable.
     */
    isExpandable(name) {
      var macro = this.macros.get(name);
      return macro != null ? typeof macro === "string" || typeof macro === "function" || !macro.unexpandable : functions.hasOwnProperty(name) && !functions[name].primitive;
    }
  };
  var unicodeSubRegEx = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/;
  var uSubsAndSups = Object.freeze({
    "\u208A": "+",
    "\u208B": "-",
    "\u208C": "=",
    "\u208D": "(",
    "\u208E": ")",
    "\u2080": "0",
    "\u2081": "1",
    "\u2082": "2",
    "\u2083": "3",
    "\u2084": "4",
    "\u2085": "5",
    "\u2086": "6",
    "\u2087": "7",
    "\u2088": "8",
    "\u2089": "9",
    "\u2090": "a",
    "\u2091": "e",
    "\u2095": "h",
    "\u1D62": "i",
    "\u2C7C": "j",
    "\u2096": "k",
    "\u2097": "l",
    "\u2098": "m",
    "\u2099": "n",
    "\u2092": "o",
    "\u209A": "p",
    "\u1D63": "r",
    "\u209B": "s",
    "\u209C": "t",
    "\u1D64": "u",
    "\u1D65": "v",
    "\u2093": "x",
    "\u1D66": "\u03B2",
    "\u1D67": "\u03B3",
    "\u1D68": "\u03C1",
    "\u1D69": "\u03D5",
    "\u1D6A": "\u03C7",
    "\u207A": "+",
    "\u207B": "-",
    "\u207C": "=",
    "\u207D": "(",
    "\u207E": ")",
    "\u2070": "0",
    "\xB9": "1",
    "\xB2": "2",
    "\xB3": "3",
    "\u2074": "4",
    "\u2075": "5",
    "\u2076": "6",
    "\u2077": "7",
    "\u2078": "8",
    "\u2079": "9",
    "\u1D2C": "A",
    "\u1D2E": "B",
    "\u1D30": "D",
    "\u1D31": "E",
    "\u1D33": "G",
    "\u1D34": "H",
    "\u1D35": "I",
    "\u1D36": "J",
    "\u1D37": "K",
    "\u1D38": "L",
    "\u1D39": "M",
    "\u1D3A": "N",
    "\u1D3C": "O",
    "\u1D3E": "P",
    "\u1D3F": "R",
    "\u1D40": "T",
    "\u1D41": "U",
    "\u2C7D": "V",
    "\u1D42": "W",
    "\u1D43": "a",
    "\u1D47": "b",
    "\u1D9C": "c",
    "\u1D48": "d",
    "\u1D49": "e",
    "\u1DA0": "f",
    "\u1D4D": "g",
    "\u02B0": "h",
    "\u2071": "i",
    "\u02B2": "j",
    "\u1D4F": "k",
    "\u02E1": "l",
    "\u1D50": "m",
    "\u207F": "n",
    "\u1D52": "o",
    "\u1D56": "p",
    "\u02B3": "r",
    "\u02E2": "s",
    "\u1D57": "t",
    "\u1D58": "u",
    "\u1D5B": "v",
    "\u02B7": "w",
    "\u02E3": "x",
    "\u02B8": "y",
    "\u1DBB": "z",
    "\u1D5D": "\u03B2",
    "\u1D5E": "\u03B3",
    "\u1D5F": "\u03B4",
    "\u1D60": "\u03D5",
    "\u1D61": "\u03C7",
    "\u1DBF": "\u03B8"
  });
  var unicodeAccents = {
    "\u0301": {
      "text": "\\'",
      "math": "\\acute"
    },
    "\u0300": {
      "text": "\\`",
      "math": "\\grave"
    },
    "\u0308": {
      "text": '\\"',
      "math": "\\ddot"
    },
    "\u0303": {
      "text": "\\~",
      "math": "\\tilde"
    },
    "\u0304": {
      "text": "\\=",
      "math": "\\bar"
    },
    "\u0306": {
      "text": "\\u",
      "math": "\\breve"
    },
    "\u030C": {
      "text": "\\v",
      "math": "\\check"
    },
    "\u0302": {
      "text": "\\^",
      "math": "\\hat"
    },
    "\u0307": {
      "text": "\\.",
      "math": "\\dot"
    },
    "\u030A": {
      "text": "\\r",
      "math": "\\mathring"
    },
    "\u030B": {
      "text": "\\H"
    },
    "\u0327": {
      "text": "\\c"
    }
  };
  var unicodeSymbols = {
    "\xE1": "a\u0301",
    "\xE0": "a\u0300",
    "\xE4": "a\u0308",
    "\u01DF": "a\u0308\u0304",
    "\xE3": "a\u0303",
    "\u0101": "a\u0304",
    "\u0103": "a\u0306",
    "\u1EAF": "a\u0306\u0301",
    "\u1EB1": "a\u0306\u0300",
    "\u1EB5": "a\u0306\u0303",
    "\u01CE": "a\u030C",
    "\xE2": "a\u0302",
    "\u1EA5": "a\u0302\u0301",
    "\u1EA7": "a\u0302\u0300",
    "\u1EAB": "a\u0302\u0303",
    "\u0227": "a\u0307",
    "\u01E1": "a\u0307\u0304",
    "\xE5": "a\u030A",
    "\u01FB": "a\u030A\u0301",
    "\u1E03": "b\u0307",
    "\u0107": "c\u0301",
    "\u1E09": "c\u0327\u0301",
    "\u010D": "c\u030C",
    "\u0109": "c\u0302",
    "\u010B": "c\u0307",
    "\xE7": "c\u0327",
    "\u010F": "d\u030C",
    "\u1E0B": "d\u0307",
    "\u1E11": "d\u0327",
    "\xE9": "e\u0301",
    "\xE8": "e\u0300",
    "\xEB": "e\u0308",
    "\u1EBD": "e\u0303",
    "\u0113": "e\u0304",
    "\u1E17": "e\u0304\u0301",
    "\u1E15": "e\u0304\u0300",
    "\u0115": "e\u0306",
    "\u1E1D": "e\u0327\u0306",
    "\u011B": "e\u030C",
    "\xEA": "e\u0302",
    "\u1EBF": "e\u0302\u0301",
    "\u1EC1": "e\u0302\u0300",
    "\u1EC5": "e\u0302\u0303",
    "\u0117": "e\u0307",
    "\u0229": "e\u0327",
    "\u1E1F": "f\u0307",
    "\u01F5": "g\u0301",
    "\u1E21": "g\u0304",
    "\u011F": "g\u0306",
    "\u01E7": "g\u030C",
    "\u011D": "g\u0302",
    "\u0121": "g\u0307",
    "\u0123": "g\u0327",
    "\u1E27": "h\u0308",
    "\u021F": "h\u030C",
    "\u0125": "h\u0302",
    "\u1E23": "h\u0307",
    "\u1E29": "h\u0327",
    "\xED": "i\u0301",
    "\xEC": "i\u0300",
    "\xEF": "i\u0308",
    "\u1E2F": "i\u0308\u0301",
    "\u0129": "i\u0303",
    "\u012B": "i\u0304",
    "\u012D": "i\u0306",
    "\u01D0": "i\u030C",
    "\xEE": "i\u0302",
    "\u01F0": "j\u030C",
    "\u0135": "j\u0302",
    "\u1E31": "k\u0301",
    "\u01E9": "k\u030C",
    "\u0137": "k\u0327",
    "\u013A": "l\u0301",
    "\u013E": "l\u030C",
    "\u013C": "l\u0327",
    "\u1E3F": "m\u0301",
    "\u1E41": "m\u0307",
    "\u0144": "n\u0301",
    "\u01F9": "n\u0300",
    "\xF1": "n\u0303",
    "\u0148": "n\u030C",
    "\u1E45": "n\u0307",
    "\u0146": "n\u0327",
    "\xF3": "o\u0301",
    "\xF2": "o\u0300",
    "\xF6": "o\u0308",
    "\u022B": "o\u0308\u0304",
    "\xF5": "o\u0303",
    "\u1E4D": "o\u0303\u0301",
    "\u1E4F": "o\u0303\u0308",
    "\u022D": "o\u0303\u0304",
    "\u014D": "o\u0304",
    "\u1E53": "o\u0304\u0301",
    "\u1E51": "o\u0304\u0300",
    "\u014F": "o\u0306",
    "\u01D2": "o\u030C",
    "\xF4": "o\u0302",
    "\u1ED1": "o\u0302\u0301",
    "\u1ED3": "o\u0302\u0300",
    "\u1ED7": "o\u0302\u0303",
    "\u022F": "o\u0307",
    "\u0231": "o\u0307\u0304",
    "\u0151": "o\u030B",
    "\u1E55": "p\u0301",
    "\u1E57": "p\u0307",
    "\u0155": "r\u0301",
    "\u0159": "r\u030C",
    "\u1E59": "r\u0307",
    "\u0157": "r\u0327",
    "\u015B": "s\u0301",
    "\u1E65": "s\u0301\u0307",
    "\u0161": "s\u030C",
    "\u1E67": "s\u030C\u0307",
    "\u015D": "s\u0302",
    "\u1E61": "s\u0307",
    "\u015F": "s\u0327",
    "\u1E97": "t\u0308",
    "\u0165": "t\u030C",
    "\u1E6B": "t\u0307",
    "\u0163": "t\u0327",
    "\xFA": "u\u0301",
    "\xF9": "u\u0300",
    "\xFC": "u\u0308",
    "\u01D8": "u\u0308\u0301",
    "\u01DC": "u\u0308\u0300",
    "\u01D6": "u\u0308\u0304",
    "\u01DA": "u\u0308\u030C",
    "\u0169": "u\u0303",
    "\u1E79": "u\u0303\u0301",
    "\u016B": "u\u0304",
    "\u1E7B": "u\u0304\u0308",
    "\u016D": "u\u0306",
    "\u01D4": "u\u030C",
    "\xFB": "u\u0302",
    "\u016F": "u\u030A",
    "\u0171": "u\u030B",
    "\u1E7D": "v\u0303",
    "\u1E83": "w\u0301",
    "\u1E81": "w\u0300",
    "\u1E85": "w\u0308",
    "\u0175": "w\u0302",
    "\u1E87": "w\u0307",
    "\u1E98": "w\u030A",
    "\u1E8D": "x\u0308",
    "\u1E8B": "x\u0307",
    "\xFD": "y\u0301",
    "\u1EF3": "y\u0300",
    "\xFF": "y\u0308",
    "\u1EF9": "y\u0303",
    "\u0233": "y\u0304",
    "\u0177": "y\u0302",
    "\u1E8F": "y\u0307",
    "\u1E99": "y\u030A",
    "\u017A": "z\u0301",
    "\u017E": "z\u030C",
    "\u1E91": "z\u0302",
    "\u017C": "z\u0307",
    "\xC1": "A\u0301",
    "\xC0": "A\u0300",
    "\xC4": "A\u0308",
    "\u01DE": "A\u0308\u0304",
    "\xC3": "A\u0303",
    "\u0100": "A\u0304",
    "\u0102": "A\u0306",
    "\u1EAE": "A\u0306\u0301",
    "\u1EB0": "A\u0306\u0300",
    "\u1EB4": "A\u0306\u0303",
    "\u01CD": "A\u030C",
    "\xC2": "A\u0302",
    "\u1EA4": "A\u0302\u0301",
    "\u1EA6": "A\u0302\u0300",
    "\u1EAA": "A\u0302\u0303",
    "\u0226": "A\u0307",
    "\u01E0": "A\u0307\u0304",
    "\xC5": "A\u030A",
    "\u01FA": "A\u030A\u0301",
    "\u1E02": "B\u0307",
    "\u0106": "C\u0301",
    "\u1E08": "C\u0327\u0301",
    "\u010C": "C\u030C",
    "\u0108": "C\u0302",
    "\u010A": "C\u0307",
    "\xC7": "C\u0327",
    "\u010E": "D\u030C",
    "\u1E0A": "D\u0307",
    "\u1E10": "D\u0327",
    "\xC9": "E\u0301",
    "\xC8": "E\u0300",
    "\xCB": "E\u0308",
    "\u1EBC": "E\u0303",
    "\u0112": "E\u0304",
    "\u1E16": "E\u0304\u0301",
    "\u1E14": "E\u0304\u0300",
    "\u0114": "E\u0306",
    "\u1E1C": "E\u0327\u0306",
    "\u011A": "E\u030C",
    "\xCA": "E\u0302",
    "\u1EBE": "E\u0302\u0301",
    "\u1EC0": "E\u0302\u0300",
    "\u1EC4": "E\u0302\u0303",
    "\u0116": "E\u0307",
    "\u0228": "E\u0327",
    "\u1E1E": "F\u0307",
    "\u01F4": "G\u0301",
    "\u1E20": "G\u0304",
    "\u011E": "G\u0306",
    "\u01E6": "G\u030C",
    "\u011C": "G\u0302",
    "\u0120": "G\u0307",
    "\u0122": "G\u0327",
    "\u1E26": "H\u0308",
    "\u021E": "H\u030C",
    "\u0124": "H\u0302",
    "\u1E22": "H\u0307",
    "\u1E28": "H\u0327",
    "\xCD": "I\u0301",
    "\xCC": "I\u0300",
    "\xCF": "I\u0308",
    "\u1E2E": "I\u0308\u0301",
    "\u0128": "I\u0303",
    "\u012A": "I\u0304",
    "\u012C": "I\u0306",
    "\u01CF": "I\u030C",
    "\xCE": "I\u0302",
    "\u0130": "I\u0307",
    "\u0134": "J\u0302",
    "\u1E30": "K\u0301",
    "\u01E8": "K\u030C",
    "\u0136": "K\u0327",
    "\u0139": "L\u0301",
    "\u013D": "L\u030C",
    "\u013B": "L\u0327",
    "\u1E3E": "M\u0301",
    "\u1E40": "M\u0307",
    "\u0143": "N\u0301",
    "\u01F8": "N\u0300",
    "\xD1": "N\u0303",
    "\u0147": "N\u030C",
    "\u1E44": "N\u0307",
    "\u0145": "N\u0327",
    "\xD3": "O\u0301",
    "\xD2": "O\u0300",
    "\xD6": "O\u0308",
    "\u022A": "O\u0308\u0304",
    "\xD5": "O\u0303",
    "\u1E4C": "O\u0303\u0301",
    "\u1E4E": "O\u0303\u0308",
    "\u022C": "O\u0303\u0304",
    "\u014C": "O\u0304",
    "\u1E52": "O\u0304\u0301",
    "\u1E50": "O\u0304\u0300",
    "\u014E": "O\u0306",
    "\u01D1": "O\u030C",
    "\xD4": "O\u0302",
    "\u1ED0": "O\u0302\u0301",
    "\u1ED2": "O\u0302\u0300",
    "\u1ED6": "O\u0302\u0303",
    "\u022E": "O\u0307",
    "\u0230": "O\u0307\u0304",
    "\u0150": "O\u030B",
    "\u1E54": "P\u0301",
    "\u1E56": "P\u0307",
    "\u0154": "R\u0301",
    "\u0158": "R\u030C",
    "\u1E58": "R\u0307",
    "\u0156": "R\u0327",
    "\u015A": "S\u0301",
    "\u1E64": "S\u0301\u0307",
    "\u0160": "S\u030C",
    "\u1E66": "S\u030C\u0307",
    "\u015C": "S\u0302",
    "\u1E60": "S\u0307",
    "\u015E": "S\u0327",
    "\u0164": "T\u030C",
    "\u1E6A": "T\u0307",
    "\u0162": "T\u0327",
    "\xDA": "U\u0301",
    "\xD9": "U\u0300",
    "\xDC": "U\u0308",
    "\u01D7": "U\u0308\u0301",
    "\u01DB": "U\u0308\u0300",
    "\u01D5": "U\u0308\u0304",
    "\u01D9": "U\u0308\u030C",
    "\u0168": "U\u0303",
    "\u1E78": "U\u0303\u0301",
    "\u016A": "U\u0304",
    "\u1E7A": "U\u0304\u0308",
    "\u016C": "U\u0306",
    "\u01D3": "U\u030C",
    "\xDB": "U\u0302",
    "\u016E": "U\u030A",
    "\u0170": "U\u030B",
    "\u1E7C": "V\u0303",
    "\u1E82": "W\u0301",
    "\u1E80": "W\u0300",
    "\u1E84": "W\u0308",
    "\u0174": "W\u0302",
    "\u1E86": "W\u0307",
    "\u1E8C": "X\u0308",
    "\u1E8A": "X\u0307",
    "\xDD": "Y\u0301",
    "\u1EF2": "Y\u0300",
    "\u0178": "Y\u0308",
    "\u1EF8": "Y\u0303",
    "\u0232": "Y\u0304",
    "\u0176": "Y\u0302",
    "\u1E8E": "Y\u0307",
    "\u0179": "Z\u0301",
    "\u017D": "Z\u030C",
    "\u1E90": "Z\u0302",
    "\u017B": "Z\u0307",
    "\u03AC": "\u03B1\u0301",
    "\u1F70": "\u03B1\u0300",
    "\u1FB1": "\u03B1\u0304",
    "\u1FB0": "\u03B1\u0306",
    "\u03AD": "\u03B5\u0301",
    "\u1F72": "\u03B5\u0300",
    "\u03AE": "\u03B7\u0301",
    "\u1F74": "\u03B7\u0300",
    "\u03AF": "\u03B9\u0301",
    "\u1F76": "\u03B9\u0300",
    "\u03CA": "\u03B9\u0308",
    "\u0390": "\u03B9\u0308\u0301",
    "\u1FD2": "\u03B9\u0308\u0300",
    "\u1FD1": "\u03B9\u0304",
    "\u1FD0": "\u03B9\u0306",
    "\u03CC": "\u03BF\u0301",
    "\u1F78": "\u03BF\u0300",
    "\u03CD": "\u03C5\u0301",
    "\u1F7A": "\u03C5\u0300",
    "\u03CB": "\u03C5\u0308",
    "\u03B0": "\u03C5\u0308\u0301",
    "\u1FE2": "\u03C5\u0308\u0300",
    "\u1FE1": "\u03C5\u0304",
    "\u1FE0": "\u03C5\u0306",
    "\u03CE": "\u03C9\u0301",
    "\u1F7C": "\u03C9\u0300",
    "\u038E": "\u03A5\u0301",
    "\u1FEA": "\u03A5\u0300",
    "\u03AB": "\u03A5\u0308",
    "\u1FE9": "\u03A5\u0304",
    "\u1FE8": "\u03A5\u0306",
    "\u038F": "\u03A9\u0301",
    "\u1FFA": "\u03A9\u0300"
  };
  var Parser = class _Parser {
    constructor(input, settings) {
      this.mode = void 0;
      this.gullet = void 0;
      this.settings = void 0;
      this.leftrightDepth = void 0;
      this.nextToken = void 0;
      this.mode = "math";
      this.gullet = new MacroExpander(input, settings, this.mode);
      this.settings = settings;
      this.leftrightDepth = 0;
      this.nextToken = null;
    }
    /**
     * Checks a result to make sure it has the right type, and throws an
     * appropriate error otherwise.
     */
    expect(text4, consume) {
      if (consume === void 0) {
        consume = true;
      }
      if (this.fetch().text !== text4) {
        throw new ParseError("Expected '" + text4 + "', got '" + this.fetch().text + "'", this.fetch());
      }
      if (consume) {
        this.consume();
      }
    }
    /**
     * Discards the current lookahead token, considering it consumed.
     */
    consume() {
      this.nextToken = null;
    }
    /**
     * Return the current lookahead token, or if there isn't one (at the
     * beginning, or if the previous lookahead token was consume()d),
     * fetch the next token as the new lookahead token and return it.
     */
    fetch() {
      if (this.nextToken == null) {
        this.nextToken = this.gullet.expandNextToken();
      }
      return this.nextToken;
    }
    /**
     * Switches between "text" and "math" modes.
     */
    switchMode(newMode) {
      this.mode = newMode;
      this.gullet.switchMode(newMode);
    }
    /**
     * Main parsing function, which parses an entire input.
     */
    parse() {
      if (!this.settings.globalGroup) {
        this.gullet.beginGroup();
      }
      if (this.settings.colorIsTextColor) {
        this.gullet.macros.set("\\color", "\\textcolor");
      }
      try {
        var parse2 = this.parseExpression(false);
        this.expect("EOF");
        if (!this.settings.globalGroup) {
          this.gullet.endGroup();
        }
        return parse2;
      } finally {
        this.gullet.endGroups();
      }
    }
    /**
     * Fully parse a separate sequence of tokens as a separate job.
     * Tokens should be specified in reverse order, as in a MacroDefinition.
     */
    subparse(tokens) {
      var oldToken = this.nextToken;
      this.consume();
      this.gullet.pushToken(new Token("}"));
      this.gullet.pushTokens(tokens);
      var parse2 = this.parseExpression(false);
      this.expect("}");
      this.nextToken = oldToken;
      return parse2;
    }
    /**
     * Parses an "expression", which is a list of atoms.
     *
     * `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
     *                 happens when functions have higher precedence than infix
     *                 nodes in implicit parses.
     *
     * `breakOnTokenText`: The text of the token that the expression should end
     *                     with, or `null` if something else should end the
     *                     expression.
     */
    parseExpression(breakOnInfix, breakOnTokenText) {
      var body = [];
      while (true) {
        if (this.mode === "math") {
          this.consumeSpaces();
        }
        var lex = this.fetch();
        if (_Parser.endOfExpression.has(lex.text)) {
          break;
        }
        if (breakOnTokenText && lex.text === breakOnTokenText) {
          break;
        }
        if (breakOnInfix && functions[lex.text] && functions[lex.text].infix) {
          break;
        }
        var atom = this.parseAtom(breakOnTokenText);
        if (!atom) {
          break;
        } else if (atom.type === "internal") {
          continue;
        }
        body.push(atom);
      }
      if (this.mode === "text") {
        this.formLigatures(body);
      }
      return this.handleInfixNodes(body);
    }
    /**
     * Rewrites infix operators such as \over with corresponding commands such
     * as \frac.
     *
     * There can only be one infix operator per group.  If there's more than one
     * then the expression is ambiguous.  This can be resolved by adding {}.
     */
    handleInfixNodes(body) {
      var overIndex = -1;
      var funcName;
      for (var i = 0; i < body.length; i++) {
        var node = body[i];
        if (node.type === "infix") {
          if (overIndex !== -1) {
            throw new ParseError("only one infix operator per group", node.token);
          }
          overIndex = i;
          funcName = node.replaceWith;
        }
      }
      if (overIndex !== -1 && funcName) {
        var numerNode;
        var denomNode;
        var numerBody = body.slice(0, overIndex);
        var denomBody = body.slice(overIndex + 1);
        if (numerBody.length === 1 && numerBody[0].type === "ordgroup") {
          numerNode = numerBody[0];
        } else {
          numerNode = {
            type: "ordgroup",
            mode: this.mode,
            body: numerBody
          };
        }
        if (denomBody.length === 1 && denomBody[0].type === "ordgroup") {
          denomNode = denomBody[0];
        } else {
          denomNode = {
            type: "ordgroup",
            mode: this.mode,
            body: denomBody
          };
        }
        var _node;
        if (funcName === "\\\\abovefrac") {
          _node = this.callFunction(funcName, [numerNode, body[overIndex], denomNode], []);
        } else {
          _node = this.callFunction(funcName, [numerNode, denomNode], []);
        }
        return [_node];
      } else {
        return body;
      }
    }
    /**
     * Handle a subscript or superscript with nice errors.
     */
    handleSupSubscript(name) {
      var symbolToken = this.fetch();
      var symbol = symbolToken.text;
      this.consume();
      this.consumeSpaces();
      var group;
      do {
        var _group;
        group = this.parseGroup(name);
      } while (((_group = group) == null ? void 0 : _group.type) === "internal");
      if (!group) {
        throw new ParseError("Expected group after '" + symbol + "'", symbolToken);
      }
      return group;
    }
    /**
     * Converts the textual input of an unsupported command into a text node
     * contained within a color node whose color is determined by errorColor
     */
    formatUnsupportedCmd(text4) {
      var textordArray = [];
      for (var i = 0; i < text4.length; i++) {
        textordArray.push({
          type: "textord",
          mode: "text",
          text: text4[i]
        });
      }
      var textNode = {
        type: "text",
        mode: this.mode,
        body: textordArray
      };
      var colorNode = {
        type: "color",
        mode: this.mode,
        color: this.settings.errorColor,
        body: [textNode]
      };
      return colorNode;
    }
    /**
     * Parses a group with optional super/subscripts.
     */
    parseAtom(breakOnTokenText) {
      var base = this.parseGroup("atom", breakOnTokenText);
      if ((base == null ? void 0 : base.type) === "internal") {
        return base;
      }
      if (this.mode === "text") {
        return base;
      }
      var superscript;
      var subscript;
      while (true) {
        this.consumeSpaces();
        var lex = this.fetch();
        if (lex.text === "\\limits" || lex.text === "\\nolimits") {
          if (base && base.type === "op") {
            var limits = lex.text === "\\limits";
            base.limits = limits;
            base.alwaysHandleSupSub = true;
          } else if (base && base.type === "operatorname") {
            if (base.alwaysHandleSupSub) {
              base.limits = lex.text === "\\limits";
            }
          } else {
            throw new ParseError("Limit controls must follow a math operator", lex);
          }
          this.consume();
        } else if (lex.text === "^") {
          if (superscript) {
            throw new ParseError("Double superscript", lex);
          }
          superscript = this.handleSupSubscript("superscript");
        } else if (lex.text === "_") {
          if (subscript) {
            throw new ParseError("Double subscript", lex);
          }
          subscript = this.handleSupSubscript("subscript");
        } else if (lex.text === "'") {
          if (superscript) {
            throw new ParseError("Double superscript", lex);
          }
          var prime = {
            type: "textord",
            mode: this.mode,
            text: "\\prime"
          };
          var primes = [prime];
          this.consume();
          while (this.fetch().text === "'") {
            primes.push(prime);
            this.consume();
          }
          if (this.fetch().text === "^") {
            primes.push(this.handleSupSubscript("superscript"));
          }
          superscript = {
            type: "ordgroup",
            mode: this.mode,
            body: primes
          };
        } else if (uSubsAndSups[lex.text]) {
          var isSub = unicodeSubRegEx.test(lex.text);
          var subsupTokens = [];
          subsupTokens.push(new Token(uSubsAndSups[lex.text]));
          this.consume();
          while (true) {
            var token = this.fetch().text;
            if (!uSubsAndSups[token]) {
              break;
            }
            if (unicodeSubRegEx.test(token) !== isSub) {
              break;
            }
            subsupTokens.unshift(new Token(uSubsAndSups[token]));
            this.consume();
          }
          var body = this.subparse(subsupTokens);
          if (isSub) {
            subscript = {
              type: "ordgroup",
              mode: "math",
              body
            };
          } else {
            superscript = {
              type: "ordgroup",
              mode: "math",
              body
            };
          }
        } else {
          break;
        }
      }
      if (superscript || subscript) {
        return {
          type: "supsub",
          mode: this.mode,
          base,
          sup: superscript,
          sub: subscript
        };
      } else {
        return base;
      }
    }
    /**
     * Parses an entire function, including its base and all of its arguments.
     */
    parseFunction(breakOnTokenText, name) {
      var token = this.fetch();
      var func = token.text;
      var funcData = functions[func];
      if (!funcData) {
        return null;
      }
      this.consume();
      if (name && name !== "atom" && !funcData.allowedInArgument) {
        throw new ParseError("Got function '" + func + "' with no arguments" + (name ? " as " + name : ""), token);
      } else if (this.mode === "text" && !funcData.allowedInText) {
        throw new ParseError("Can't use function '" + func + "' in text mode", token);
      } else if (this.mode === "math" && funcData.allowedInMath === false) {
        throw new ParseError("Can't use function '" + func + "' in math mode", token);
      }
      var {
        args,
        optArgs
      } = this.parseArguments(func, funcData);
      return this.callFunction(func, args, optArgs, token, breakOnTokenText);
    }
    /**
     * Call a function handler with a suitable context and arguments.
     */
    callFunction(name, args, optArgs, token, breakOnTokenText) {
      var context = {
        funcName: name,
        parser: this,
        token,
        breakOnTokenText
      };
      var func = functions[name];
      if (func && func.handler) {
        return func.handler(context, args, optArgs);
      } else {
        throw new ParseError("No function handler for " + name);
      }
    }
    /**
     * Parses the arguments of a function or environment
     */
    parseArguments(func, funcData) {
      var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
      if (totalArgs === 0) {
        return {
          args: [],
          optArgs: []
        };
      }
      var args = [];
      var optArgs = [];
      for (var i = 0; i < totalArgs; i++) {
        var argType = funcData.argTypes && funcData.argTypes[i];
        var isOptional = i < funcData.numOptionalArgs;
        if ("primitive" in funcData && funcData.primitive && argType == null || // \sqrt expands into primitive if optional argument doesn't exist
        funcData.type === "sqrt" && i === 1 && optArgs[0] == null) {
          argType = "primitive";
        }
        var arg = this.parseGroupOfType("argument to '" + func + "'", argType, isOptional);
        if (isOptional) {
          optArgs.push(arg);
        } else if (arg != null) {
          args.push(arg);
        } else {
          throw new ParseError("Null argument, please report this as a bug");
        }
      }
      return {
        args,
        optArgs
      };
    }
    /**
     * Parses a group when the mode is changing.
     */
    parseGroupOfType(name, type, optional) {
      switch (type) {
        case "color":
          return this.parseColorGroup(optional);
        case "size":
          return this.parseSizeGroup(optional);
        case "url":
          return this.parseUrlGroup(optional);
        case "math":
        case "text":
          return this.parseArgumentGroup(optional, type);
        case "hbox": {
          var group = this.parseArgumentGroup(optional, "text");
          return group != null ? {
            type: "styling",
            mode: group.mode,
            body: [group],
            style: "text",
            // simulate \textstyle
            resetFont: true
          } : null;
        }
        case "raw": {
          var token = this.parseStringGroup("raw", optional);
          return token != null ? {
            type: "raw",
            mode: "text",
            string: token.text
          } : null;
        }
        case "primitive": {
          if (optional) {
            throw new ParseError("A primitive argument cannot be optional");
          }
          var _group2 = this.parseGroup(name);
          if (_group2 == null) {
            throw new ParseError("Expected group as " + name, this.fetch());
          }
          return _group2;
        }
        case "original":
        case null:
        case void 0:
          return this.parseArgumentGroup(optional);
        default:
          throw new ParseError("Unknown group type as " + name, this.fetch());
      }
    }
    /**
     * Discard any space tokens, fetching the next non-space token.
     */
    consumeSpaces() {
      while (this.fetch().text === " ") {
        this.consume();
      }
    }
    /**
     * Parses a group, essentially returning the string formed by the
     * brace-enclosed tokens plus some position information.
     */
    parseStringGroup(modeName, optional) {
      var argToken = this.gullet.scanArgument(optional);
      if (argToken == null) {
        return null;
      }
      var str = "";
      var nextToken;
      while ((nextToken = this.fetch()).text !== "EOF") {
        str += nextToken.text;
        this.consume();
      }
      this.consume();
      argToken.text = str;
      return argToken;
    }
    /**
     * Parses a regex-delimited group: the largest sequence of tokens
     * whose concatenated strings match `regex`. Returns the string
     * formed by the tokens plus some position information.
     */
    parseRegexGroup(regex, modeName) {
      var firstToken = this.fetch();
      var lastToken = firstToken;
      var str = "";
      var nextToken;
      while ((nextToken = this.fetch()).text !== "EOF" && regex.test(str + nextToken.text)) {
        lastToken = nextToken;
        str += lastToken.text;
        this.consume();
      }
      if (str === "") {
        throw new ParseError("Invalid " + modeName + ": '" + firstToken.text + "'", firstToken);
      }
      return firstToken.range(lastToken, str);
    }
    /**
     * Parses a color description.
     */
    parseColorGroup(optional) {
      var res = this.parseStringGroup("color", optional);
      if (res == null) {
        return null;
      }
      var match = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(res.text);
      if (!match) {
        throw new ParseError("Invalid color: '" + res.text + "'", res);
      }
      var color = match[0];
      if (/^[0-9a-f]{6}$/i.test(color)) {
        color = "#" + color;
      }
      return {
        type: "color-token",
        mode: this.mode,
        color
      };
    }
    /**
     * Parses a size specification, consisting of magnitude and unit.
     */
    parseSizeGroup(optional) {
      var res;
      var isBlank = false;
      this.gullet.consumeSpaces();
      if (!optional && this.gullet.future().text !== "{") {
        res = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size");
      } else {
        res = this.parseStringGroup("size", optional);
      }
      if (!res) {
        return null;
      }
      if (!optional && res.text.length === 0) {
        res.text = "0pt";
        isBlank = true;
      }
      var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(res.text);
      if (!match) {
        throw new ParseError("Invalid size: '" + res.text + "'", res);
      }
      var data = {
        number: +(match[1] + match[2]),
        // sign + magnitude, cast to number
        unit: match[3]
      };
      if (!validUnit(data)) {
        throw new ParseError("Invalid unit: '" + data.unit + "'", res);
      }
      return {
        type: "size",
        mode: this.mode,
        value: data,
        isBlank
      };
    }
    /**
     * Parses an URL, checking escaped letters and allowed protocols,
     * and setting the catcode of % as an active character (as in \hyperref).
     */
    parseUrlGroup(optional) {
      this.gullet.lexer.setCatcode("%", 13);
      this.gullet.lexer.setCatcode("~", 12);
      var res = this.parseStringGroup("url", optional);
      this.gullet.lexer.setCatcode("%", 14);
      this.gullet.lexer.setCatcode("~", 13);
      if (res == null) {
        return null;
      }
      var url = res.text.replace(/\\([#$%&~_^{}])/g, "$1");
      return {
        type: "url",
        mode: this.mode,
        url
      };
    }
    /**
     * Parses an argument with the mode specified.
     */
    parseArgumentGroup(optional, mode) {
      var argToken = this.gullet.scanArgument(optional);
      if (argToken == null) {
        return null;
      }
      var outerMode = this.mode;
      if (mode) {
        this.switchMode(mode);
      }
      this.gullet.beginGroup();
      var expression = this.parseExpression(false, "EOF");
      this.expect("EOF");
      this.gullet.endGroup();
      var result = {
        type: "ordgroup",
        mode: this.mode,
        loc: argToken.loc,
        body: expression
      };
      if (mode) {
        this.switchMode(outerMode);
      }
      return result;
    }
    /**
     * Parses an ordinary group, which is either a single nucleus (like "x")
     * or an expression in braces (like "{x+y}") or an implicit group, a group
     * that starts at the current position, and ends right before a higher explicit
     * group ends, or at EOF.
     */
    parseGroup(name, breakOnTokenText) {
      var firstToken = this.fetch();
      var text4 = firstToken.text;
      var result;
      if (text4 === "{" || text4 === "\\begingroup") {
        this.consume();
        var groupEnd = text4 === "{" ? "}" : "\\endgroup";
        this.gullet.beginGroup();
        var expression = this.parseExpression(false, groupEnd);
        var lastToken = this.fetch();
        this.expect(groupEnd);
        this.gullet.endGroup();
        result = {
          type: "ordgroup",
          mode: this.mode,
          loc: SourceLocation.range(firstToken, lastToken),
          body: expression,
          // A group formed by \begingroup...\endgroup is a semi-simple group
          // which doesn't affect spacing in math mode, i.e., is transparent.
          // https://tex.stackexchange.com/questions/1930/when-should-one-
          // use-begingroup-instead-of-bgroup
          semisimple: text4 === "\\begingroup" || void 0
        };
      } else {
        result = this.parseFunction(breakOnTokenText, name) || this.parseSymbol();
        if (result == null && text4[0] === "\\" && !implicitCommands.hasOwnProperty(text4)) {
          if (this.settings.throwOnError) {
            throw new ParseError("Undefined control sequence: " + text4, firstToken);
          }
          result = this.formatUnsupportedCmd(text4);
          this.consume();
        }
      }
      return result;
    }
    /**
     * Form ligature-like combinations of characters for text mode.
     * This includes inputs like "--", "---", "``" and "''".
     * The result will simply replace multiple textord nodes with a single
     * character in each value by a single textord node having multiple
     * characters in its value.  The representation is still ASCII source.
     * The group will be modified in place.
     */
    formLigatures(group) {
      var n = group.length - 1;
      for (var i = 0; i < n; ++i) {
        var a = group[i];
        if (a.type !== "textord") {
          continue;
        }
        var v2 = a.text;
        var next = group[i + 1];
        if (!next || next.type !== "textord") {
          continue;
        }
        if (v2 === "-" && next.text === "-") {
          var afterNext = group[i + 2];
          if (i + 1 < n && afterNext && afterNext.type === "textord" && afterNext.text === "-") {
            group.splice(i, 3, {
              type: "textord",
              mode: "text",
              loc: SourceLocation.range(a, afterNext),
              text: "---"
            });
            n -= 2;
          } else {
            group.splice(i, 2, {
              type: "textord",
              mode: "text",
              loc: SourceLocation.range(a, next),
              text: "--"
            });
            n -= 1;
          }
        }
        if ((v2 === "'" || v2 === "`") && next.text === v2) {
          group.splice(i, 2, {
            type: "textord",
            mode: "text",
            loc: SourceLocation.range(a, next),
            text: v2 + v2
          });
          n -= 1;
        }
      }
    }
    /**
     * Parse a single symbol out of the string. Here, we handle single character
     * symbols and special functions like \verb.
     */
    parseSymbol() {
      var nucleus = this.fetch();
      var text4 = nucleus.text;
      if (/^\\verb[^a-zA-Z]/.test(text4)) {
        this.consume();
        var arg = text4.slice(5);
        var star = arg.charAt(0) === "*";
        if (star) {
          arg = arg.slice(1);
        }
        if (arg.length < 2 || arg.charAt(0) !== arg.slice(-1)) {
          throw new ParseError("\\verb assertion failed --\n                    please report what input caused this bug");
        }
        arg = arg.slice(1, -1);
        return {
          type: "verb",
          mode: "text",
          body: arg,
          star
        };
      }
      if (unicodeSymbols.hasOwnProperty(text4[0]) && !symbols[this.mode][text4[0]]) {
        if (this.settings.strict && this.mode === "math") {
          this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + text4[0] + '" used in math mode', nucleus);
        }
        text4 = unicodeSymbols[text4[0]] + text4.slice(1);
      }
      var match = combiningDiacriticalMarksEndRegex.exec(text4);
      if (match) {
        text4 = text4.substring(0, match.index);
        if (text4 === "i") {
          text4 = "\u0131";
        } else if (text4 === "j") {
          text4 = "\u0237";
        }
      }
      var symbol;
      if (symbols[this.mode][text4]) {
        if (this.settings.strict && this.mode === "math" && extraLatin.includes(text4)) {
          this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + text4[0] + '" used in math mode', nucleus);
        }
        var group = symbols[this.mode][text4].group;
        var loc = SourceLocation.range(nucleus);
        var s;
        if (isAtom(group)) {
          s = {
            type: "atom",
            mode: this.mode,
            family: group,
            loc,
            text: text4
          };
        } else {
          s = {
            type: group,
            mode: this.mode,
            loc,
            text: text4
          };
        }
        symbol = s;
      } else if (text4.charCodeAt(0) >= 128) {
        if (this.settings.strict) {
          if (!supportedCodepoint(text4.charCodeAt(0))) {
            this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + text4[0] + '"' + (" (" + text4.charCodeAt(0) + ")"), nucleus);
          } else if (this.mode === "math") {
            this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + text4[0] + '" used in math mode', nucleus);
          }
        }
        symbol = {
          type: "textord",
          mode: "text",
          loc: SourceLocation.range(nucleus),
          text: text4
        };
      } else {
        return null;
      }
      this.consume();
      if (match) {
        for (var i = 0; i < match[0].length; i++) {
          var accent2 = match[0][i];
          if (!unicodeAccents[accent2]) {
            throw new ParseError("Unknown accent ' " + accent2 + "'", nucleus);
          }
          var command = unicodeAccents[accent2][this.mode] || unicodeAccents[accent2].text;
          if (!command) {
            throw new ParseError("Accent " + accent2 + " unsupported in " + this.mode + " mode", nucleus);
          }
          symbol = {
            type: "accent",
            mode: this.mode,
            loc: SourceLocation.range(nucleus),
            label: command,
            isStretchy: false,
            isShifty: true,
            base: symbol
          };
        }
      }
      return symbol;
    }
  };
  Parser.endOfExpression = /* @__PURE__ */ new Set(["}", "\\endgroup", "\\end", "\\right", "&"]);
  var parseTree = function parseTree2(toParse, settings) {
    if (!(typeof toParse === "string" || toParse instanceof String)) {
      throw new TypeError("KaTeX can only parse string typed expression");
    }
    var parser = new Parser(toParse, settings);
    delete parser.gullet.macros.current["\\df@tag"];
    var tree = parser.parse();
    delete parser.gullet.macros.current["\\current@color"];
    delete parser.gullet.macros.current["\\color"];
    if (parser.gullet.macros.get("\\df@tag")) {
      if (!settings.displayMode) {
        throw new ParseError("\\tag works only in display equations");
      }
      tree = [{
        type: "tag",
        mode: "text",
        body: tree,
        tag: parser.subparse([new Token("\\df@tag")])
      }];
    }
    return tree;
  };
  var render = function render2(expression, baseNode, options) {
    baseNode.textContent = "";
    var node = renderToDomTree(expression, options).toNode();
    baseNode.appendChild(node);
  };
  if (typeof document !== "undefined") {
    if (document.compatMode !== "CSS1Compat") {
      typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.");
      render = function render3() {
        throw new ParseError("KaTeX doesn't work in quirks mode.");
      };
    }
  }
  var renderToString = function renderToString2(expression, options) {
    var markup = renderToDomTree(expression, options).toMarkup();
    return markup;
  };
  var generateParseTree = function generateParseTree2(expression, options) {
    var settings = new Settings(options);
    return parseTree(expression, settings);
  };
  var renderError = function renderError2(error, expression, options) {
    if (options.throwOnError || !(error instanceof ParseError)) {
      throw error;
    }
    var node = makeSpan(["katex-error"], [new SymbolNode(expression)]);
    node.setAttribute("title", error.toString());
    node.setAttribute("style", "color:" + options.errorColor);
    return node;
  };
  var renderToDomTree = function renderToDomTree2(expression, options) {
    var settings = new Settings(options);
    try {
      var tree = parseTree(expression, settings);
      return buildTree(tree, expression, settings);
    } catch (error) {
      return renderError(error, expression, settings);
    }
  };
  var renderToHTMLTree = function renderToHTMLTree2(expression, options) {
    var settings = new Settings(options);
    try {
      var tree = parseTree(expression, settings);
      return buildHTMLTree(tree, expression, settings);
    } catch (error) {
      return renderError(error, expression, settings);
    }
  };
  var version = "0.16.47";
  var __domTree = {
    Span,
    Anchor,
    SymbolNode,
    SvgNode,
    PathNode,
    LineNode
  };
  var katex = {
    /**
     * Current KaTeX version
     */
    version,
    /**
     * Renders the given LaTeX into an HTML+MathML combination, and adds
     * it as a child to the specified DOM node.
     */
    render,
    /**
     * Renders the given LaTeX into an HTML+MathML combination string,
     * for sending to the client.
     */
    renderToString,
    /**
     * KaTeX error, usually during parsing.
     */
    ParseError,
    /**
     * The schema of Settings
     */
    SETTINGS_SCHEMA,
    /**
     * Parses the given LaTeX into KaTeX's internal parse tree structure,
     * without rendering to HTML or MathML.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __parse: generateParseTree,
    /**
     * Renders the given LaTeX into an HTML+MathML internal DOM tree
     * representation, without flattening that representation to a string.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __renderToDomTree: renderToDomTree,
    /**
     * Renders the given LaTeX into an HTML internal DOM tree representation,
     * without MathML and without flattening that representation to a string.
     *
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __renderToHTMLTree: renderToHTMLTree,
    /**
     * extends internal font metrics object with a new object
     * each key in the new object represents a font name
    */
    __setFontMetrics: setFontMetrics,
    /**
     * adds a new symbol to builtin symbols table
     */
    __defineSymbol: defineSymbol,
    /**
     * adds a new function to builtin function list,
     * which directly produce parse tree elements
     * and have their own html/mathml builders
     */
    __defineFunction: defineFunction,
    /**
     * adds a new macro to builtin macro list
     */
    __defineMacro: defineMacro,
    /**
     * Expose the dom tree node types, which can be useful for type checking nodes.
     *
     * NOTE: These methods are not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __domTree
  };

  // node_modules/micromark-extension-gfm-table/lib/edit-map.js
  var EditMap2 = class {
    /**
     * Create a new edit map.
     */
    constructor() {
      this.map = [];
      this.index = /* @__PURE__ */ new Map();
    }
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     *   Index at which to apply the edit.
     * @param {number} remove
     *   Count of items to remove at the index.
     * @param {Array<Event>} add
     *   Items to add at the index.
     * @returns {undefined}
     *   Nothing.
     */
    add(index, remove, add) {
      addImplementation2(this, index, remove, add);
    }
    // To do: add this when moving to `micromark`.
    // /**
    //  * Create an edit: but insert `add` before existing additions.
    //  *
    //  * @param {number} index
    //  * @param {number} remove
    //  * @param {Array<Event>} add
    //  * @returns {undefined}
    //  */
    // addBefore(index, remove, add) {
    //   addImplementation(this, index, remove, add, true)
    // }
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     *   List of events to apply the edits to.
     * @returns {undefined}
     *   Nothing.
     */
    consume(events) {
      this.map.sort(function(a, b3) {
        return a[0] - b3[0];
      });
      if (this.map.length === 0) {
        return;
      }
      let index = this.map.length;
      const vecs = [];
      while (index > 0) {
        index -= 1;
        vecs.push(events.slice(this.map[index][0] + this.map[index][1]), this.map[index][2]);
        events.length = this.map[index][0];
      }
      vecs.push(events.slice());
      events.length = 0;
      let slice = vecs.pop();
      while (slice) {
        for (const element2 of slice) {
          events.push(element2);
        }
        slice = vecs.pop();
      }
      this.map.length = 0;
      this.index.clear();
    }
  };
  function addImplementation2(editMap, at3, remove, add) {
    if (remove === 0 && add.length === 0) {
      return;
    }
    const existing = editMap.index.get(at3);
    if (existing) {
      existing[1] += remove;
      existing[2].push(...add);
      return;
    }
    const change = [at3, remove, add];
    editMap.map.push(change);
    editMap.index.set(at3, change);
  }

  // node_modules/micromark-extension-gfm-table/lib/infer.js
  function gfmTableAlign(events, index) {
    let inDelimiterRow = false;
    const align = [];
    while (index < events.length) {
      const event = events[index];
      if (inDelimiterRow) {
        if (event[0] === "enter") {
          if (event[1].type === "tableContent") {
            align.push(events[index + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
          }
        } else if (event[1].type === "tableContent") {
          if (events[index - 1][1].type === "tableDelimiterMarker") {
            const alignIndex = align.length - 1;
            align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
          }
        } else if (event[1].type === "tableDelimiterRow") {
          break;
        }
      } else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") {
        inDelimiterRow = true;
      }
      index += 1;
    }
    return align;
  }

  // node_modules/micromark-extension-gfm-table/lib/syntax.js
  function gfmTable() {
    return {
      flow: {
        null: {
          name: "table",
          tokenize: tokenizeTable,
          resolveAll: resolveTable
        }
      }
    };
  }
  function tokenizeTable(effects, ok, nok) {
    const self = this;
    let size = 0;
    let sizeB = 0;
    let seen;
    return start;
    function start(code) {
      let index = self.events.length - 1;
      while (index > -1) {
        const {
          type
        } = self.events[index][1];
        if (type === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
        type === "linePrefix") {
          index--;
        } else {
          break;
        }
      }
      const tail = index > -1 ? self.events[index][1].type : null;
      const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
      if (next === bodyRowStart && self.parser.lazy[self.now().line]) {
        return nok(code);
      }
      return next(code);
    }
    function headRowBefore(code) {
      effects.enter("tableHead");
      effects.enter("tableRow");
      return headRowStart(code);
    }
    function headRowStart(code) {
      if (code === 124) {
        return headRowBreak(code);
      }
      seen = true;
      sizeB += 1;
      return headRowBreak(code);
    }
    function headRowBreak(code) {
      if (code === null) {
        return nok(code);
      }
      if (markdownLineEnding(code)) {
        if (sizeB > 1) {
          sizeB = 0;
          self.interrupt = true;
          effects.exit("tableRow");
          effects.enter("lineEnding");
          effects.consume(code);
          effects.exit("lineEnding");
          return headDelimiterStart;
        }
        return nok(code);
      }
      if (markdownSpace(code)) {
        return factorySpace(effects, headRowBreak, "whitespace")(code);
      }
      sizeB += 1;
      if (seen) {
        seen = false;
        size += 1;
      }
      if (code === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code);
        effects.exit("tableCellDivider");
        seen = true;
        return headRowBreak;
      }
      effects.enter("data");
      return headRowData(code);
    }
    function headRowData(code) {
      if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
        effects.exit("data");
        return headRowBreak(code);
      }
      effects.consume(code);
      return code === 92 ? headRowEscape : headRowData;
    }
    function headRowEscape(code) {
      if (code === 92 || code === 124) {
        effects.consume(code);
        return headRowData;
      }
      return headRowData(code);
    }
    function headDelimiterStart(code) {
      self.interrupt = false;
      if (self.parser.lazy[self.now().line]) {
        return nok(code);
      }
      effects.enter("tableDelimiterRow");
      seen = false;
      if (markdownSpace(code)) {
        return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
      }
      return headDelimiterBefore(code);
    }
    function headDelimiterBefore(code) {
      if (code === 45 || code === 58) {
        return headDelimiterValueBefore(code);
      }
      if (code === 124) {
        seen = true;
        effects.enter("tableCellDivider");
        effects.consume(code);
        effects.exit("tableCellDivider");
        return headDelimiterCellBefore;
      }
      return headDelimiterNok(code);
    }
    function headDelimiterCellBefore(code) {
      if (markdownSpace(code)) {
        return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code);
      }
      return headDelimiterValueBefore(code);
    }
    function headDelimiterValueBefore(code) {
      if (code === 58) {
        sizeB += 1;
        seen = true;
        effects.enter("tableDelimiterMarker");
        effects.consume(code);
        effects.exit("tableDelimiterMarker");
        return headDelimiterLeftAlignmentAfter;
      }
      if (code === 45) {
        sizeB += 1;
        return headDelimiterLeftAlignmentAfter(code);
      }
      if (code === null || markdownLineEnding(code)) {
        return headDelimiterCellAfter(code);
      }
      return headDelimiterNok(code);
    }
    function headDelimiterLeftAlignmentAfter(code) {
      if (code === 45) {
        effects.enter("tableDelimiterFiller");
        return headDelimiterFiller(code);
      }
      return headDelimiterNok(code);
    }
    function headDelimiterFiller(code) {
      if (code === 45) {
        effects.consume(code);
        return headDelimiterFiller;
      }
      if (code === 58) {
        seen = true;
        effects.exit("tableDelimiterFiller");
        effects.enter("tableDelimiterMarker");
        effects.consume(code);
        effects.exit("tableDelimiterMarker");
        return headDelimiterRightAlignmentAfter;
      }
      effects.exit("tableDelimiterFiller");
      return headDelimiterRightAlignmentAfter(code);
    }
    function headDelimiterRightAlignmentAfter(code) {
      if (markdownSpace(code)) {
        return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code);
      }
      return headDelimiterCellAfter(code);
    }
    function headDelimiterCellAfter(code) {
      if (code === 124) {
        return headDelimiterBefore(code);
      }
      if (code === null || markdownLineEnding(code)) {
        if (!seen || size !== sizeB) {
          return headDelimiterNok(code);
        }
        effects.exit("tableDelimiterRow");
        effects.exit("tableHead");
        return ok(code);
      }
      return headDelimiterNok(code);
    }
    function headDelimiterNok(code) {
      return nok(code);
    }
    function bodyRowStart(code) {
      effects.enter("tableRow");
      return bodyRowBreak(code);
    }
    function bodyRowBreak(code) {
      if (code === 124) {
        effects.enter("tableCellDivider");
        effects.consume(code);
        effects.exit("tableCellDivider");
        return bodyRowBreak;
      }
      if (code === null || markdownLineEnding(code)) {
        effects.exit("tableRow");
        return ok(code);
      }
      if (markdownSpace(code)) {
        return factorySpace(effects, bodyRowBreak, "whitespace")(code);
      }
      effects.enter("data");
      return bodyRowData(code);
    }
    function bodyRowData(code) {
      if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
        effects.exit("data");
        return bodyRowBreak(code);
      }
      effects.consume(code);
      return code === 92 ? bodyRowEscape : bodyRowData;
    }
    function bodyRowEscape(code) {
      if (code === 92 || code === 124) {
        effects.consume(code);
        return bodyRowData;
      }
      return bodyRowData(code);
    }
  }
  function resolveTable(events, context) {
    let index = -1;
    let inFirstCellAwaitingPipe = true;
    let rowKind = 0;
    let lastCell = [0, 0, 0, 0];
    let cell = [0, 0, 0, 0];
    let afterHeadAwaitingFirstBodyRow = false;
    let lastTableEnd = 0;
    let currentTable;
    let currentBody;
    let currentCell;
    const map = new EditMap2();
    while (++index < events.length) {
      const event = events[index];
      const token = event[1];
      if (event[0] === "enter") {
        if (token.type === "tableHead") {
          afterHeadAwaitingFirstBodyRow = false;
          if (lastTableEnd !== 0) {
            flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
            currentBody = void 0;
            lastTableEnd = 0;
          }
          currentTable = {
            type: "table",
            start: Object.assign({}, token.start),
            // Note: correct end is set later.
            end: Object.assign({}, token.end)
          };
          map.add(index, 0, [["enter", currentTable, context]]);
        } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
          inFirstCellAwaitingPipe = true;
          currentCell = void 0;
          lastCell = [0, 0, 0, 0];
          cell = [0, index + 1, 0, 0];
          if (afterHeadAwaitingFirstBodyRow) {
            afterHeadAwaitingFirstBodyRow = false;
            currentBody = {
              type: "tableBody",
              start: Object.assign({}, token.start),
              // Note: correct end is set later.
              end: Object.assign({}, token.end)
            };
            map.add(index, 0, [["enter", currentBody, context]]);
          }
          rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
        } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
          inFirstCellAwaitingPipe = false;
          if (cell[2] === 0) {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
              lastCell = [0, 0, 0, 0];
            }
            cell[2] = index;
          }
        } else if (token.type === "tableCellDivider") {
          if (inFirstCellAwaitingPipe) {
            inFirstCellAwaitingPipe = false;
          } else {
            if (lastCell[1] !== 0) {
              cell[0] = cell[1];
              currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
            }
            lastCell = cell;
            cell = [lastCell[1], index, 0, 0];
          }
        }
      } else if (token.type === "tableHead") {
        afterHeadAwaitingFirstBodyRow = true;
        lastTableEnd = index;
      } else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
        lastTableEnd = index;
        if (lastCell[1] !== 0) {
          cell[0] = cell[1];
          currentCell = flushCell(map, context, lastCell, rowKind, index, currentCell);
        } else if (cell[1] !== 0) {
          currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
        }
        rowKind = 0;
      } else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
        cell[3] = index;
      }
    }
    if (lastTableEnd !== 0) {
      flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
    }
    map.consume(context.events);
    index = -1;
    while (++index < context.events.length) {
      const event = context.events[index];
      if (event[0] === "enter" && event[1].type === "table") {
        event[1]._align = gfmTableAlign(context.events, index);
      }
    }
    return events;
  }
  function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
    const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
    const valueName = "tableContent";
    if (range[0] !== 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
      map.add(range[0], 0, [["exit", previousCell, context]]);
    }
    const now = getPoint(context.events, range[1]);
    previousCell = {
      type: groupName,
      start: Object.assign({}, now),
      // Note: correct end is set later.
      end: Object.assign({}, now)
    };
    map.add(range[1], 0, [["enter", previousCell, context]]);
    if (range[2] !== 0) {
      const relatedStart = getPoint(context.events, range[2]);
      const relatedEnd = getPoint(context.events, range[3]);
      const valueToken = {
        type: valueName,
        start: Object.assign({}, relatedStart),
        end: Object.assign({}, relatedEnd)
      };
      map.add(range[2], 0, [["enter", valueToken, context]]);
      if (rowKind !== 2) {
        const start = context.events[range[2]];
        const end = context.events[range[3]];
        start[1].end = Object.assign({}, end[1].end);
        start[1].type = "chunkText";
        start[1].contentType = "text";
        if (range[3] > range[2] + 1) {
          const a = range[2] + 1;
          const b3 = range[3] - range[2] - 1;
          map.add(a, b3, []);
        }
      }
      map.add(range[3] + 1, 0, [["exit", valueToken, context]]);
    }
    if (rowEnd !== void 0) {
      previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
      map.add(rowEnd, 0, [["exit", previousCell, context]]);
      previousCell = void 0;
    }
    return previousCell;
  }
  function flushTableEnd(map, context, index, table, tableBody) {
    const exits = [];
    const related = getPoint(context.events, index);
    if (tableBody) {
      tableBody.end = Object.assign({}, related);
      exits.push(["exit", tableBody, context]);
    }
    table.end = Object.assign({}, related);
    exits.push(["exit", table, context]);
    map.add(index + 1, 0, exits);
  }
  function getPoint(events, index) {
    const event = events[index];
    const side = event[0] === "enter" ? "start" : "end";
    return event[1][side];
  }

  // node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
  var tasklistCheck = {
    name: "tasklistCheck",
    tokenize: tokenizeTasklistCheck
  };
  function gfmTaskListItem() {
    return {
      text: {
        [91]: tasklistCheck
      }
    };
  }
  function tokenizeTasklistCheck(effects, ok, nok) {
    const self = this;
    return open2;
    function open2(code) {
      if (
        // Exit if there’s stuff before.
        self.previous !== null || // Exit if not in the first content that is the first child of a list
        // item.
        !self._gfmTasklistFirstContentOfListItem
      ) {
        return nok(code);
      }
      effects.enter("taskListCheck");
      effects.enter("taskListCheckMarker");
      effects.consume(code);
      effects.exit("taskListCheckMarker");
      return inside;
    }
    function inside(code) {
      if (markdownLineEndingOrSpace(code)) {
        effects.enter("taskListCheckValueUnchecked");
        effects.consume(code);
        effects.exit("taskListCheckValueUnchecked");
        return close2;
      }
      if (code === 88 || code === 120) {
        effects.enter("taskListCheckValueChecked");
        effects.consume(code);
        effects.exit("taskListCheckValueChecked");
        return close2;
      }
      return nok(code);
    }
    function close2(code) {
      if (code === 93) {
        effects.enter("taskListCheckMarker");
        effects.consume(code);
        effects.exit("taskListCheckMarker");
        effects.exit("taskListCheck");
        return after;
      }
      return nok(code);
    }
    function after(code) {
      if (markdownLineEnding(code)) {
        return ok(code);
      }
      if (markdownSpace(code)) {
        return effects.check({
          tokenize: spaceThenNonSpace
        }, ok, nok)(code);
      }
      return nok(code);
    }
  }
  function spaceThenNonSpace(effects, ok, nok) {
    return factorySpace(effects, after, "whitespace");
    function after(code) {
      return code === null ? nok(code) : ok(code);
    }
  }

  // node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
  function gfmStrikethrough(options) {
    const options_ = options || {};
    let single = options_.singleTilde;
    const tokenizer = {
      name: "strikethrough",
      tokenize: tokenizeStrikethrough,
      resolveAll: resolveAllStrikethrough
    };
    if (single === null || single === void 0) {
      single = true;
    }
    return {
      text: {
        [126]: tokenizer
      },
      insideSpan: {
        null: [tokenizer]
      },
      attentionMarkers: {
        null: [126]
      }
    };
    function resolveAllStrikethrough(events, context) {
      let index = -1;
      while (++index < events.length) {
        if (events[index][0] === "enter" && events[index][1].type === "strikethroughSequenceTemporary" && events[index][1]._close) {
          let open2 = index;
          while (open2--) {
            if (events[open2][0] === "exit" && events[open2][1].type === "strikethroughSequenceTemporary" && events[open2][1]._open && // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset === events[open2][1].end.offset - events[open2][1].start.offset) {
              events[index][1].type = "strikethroughSequence";
              events[open2][1].type = "strikethroughSequence";
              const strikethrough = {
                type: "strikethrough",
                start: Object.assign({}, events[open2][1].start),
                end: Object.assign({}, events[index][1].end)
              };
              const text4 = {
                type: "strikethroughText",
                start: Object.assign({}, events[open2][1].end),
                end: Object.assign({}, events[index][1].start)
              };
              const nextEvents = [["enter", strikethrough, context], ["enter", events[open2][1], context], ["exit", events[open2][1], context], ["enter", text4, context]];
              const insideSpan2 = context.parser.constructs.insideSpan.null;
              if (insideSpan2) {
                splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan2, events.slice(open2 + 1, index), context));
              }
              splice(nextEvents, nextEvents.length, 0, [["exit", text4, context], ["enter", events[index][1], context], ["exit", events[index][1], context], ["exit", strikethrough, context]]);
              splice(events, open2 - 1, index - open2 + 3, nextEvents);
              index = open2 + nextEvents.length - 2;
              break;
            }
          }
        }
      }
      index = -1;
      while (++index < events.length) {
        if (events[index][1].type === "strikethroughSequenceTemporary") {
          events[index][1].type = "data";
        }
      }
      return events;
    }
    function tokenizeStrikethrough(effects, ok, nok) {
      const previous3 = this.previous;
      const events = this.events;
      let size = 0;
      return start;
      function start(code) {
        if (previous3 === 126 && events[events.length - 1][1].type !== "characterEscape") {
          return nok(code);
        }
        effects.enter("strikethroughSequenceTemporary");
        return more(code);
      }
      function more(code) {
        const before = classifyCharacter(previous3);
        if (code === 126) {
          if (size > 1) return nok(code);
          effects.consume(code);
          size++;
          return more;
        }
        if (size < 2 && !single) return nok(code);
        const token = effects.exit("strikethroughSequenceTemporary");
        const after = classifyCharacter(code);
        token._open = !after || after === 2 && Boolean(before);
        token._close = !before || before === 2 && Boolean(after);
        return ok(code);
      }
    }
  }

  // node_modules/@vscode/markdown-editor/dist/runOnChange-owE1SMC0.js
  var m;
  function ae(n) {
    m ? m instanceof K ? m.loggers.push(n) : m = new K([m, n]) : m = n;
  }
  function o() {
    return m;
  }
  var F;
  function de(n) {
    F = n;
  }
  function oe(n) {
    F && F(n);
  }
  var K = class {
    constructor(e) {
      this.loggers = e;
    }
    handleObservableCreated(e, t) {
      for (const s of this.loggers)
        s.handleObservableCreated(e, t);
    }
    handleOnListenerCountChanged(e, t) {
      for (const s of this.loggers)
        s.handleOnListenerCountChanged(e, t);
    }
    handleObservableUpdated(e, t) {
      for (const s of this.loggers)
        s.handleObservableUpdated(e, t);
    }
    handleAutorunCreated(e, t) {
      for (const s of this.loggers)
        s.handleAutorunCreated(e, t);
    }
    handleAutorunDisposed(e) {
      for (const t of this.loggers)
        t.handleAutorunDisposed(e);
    }
    handleAutorunDependencyChanged(e, t, s) {
      for (const r of this.loggers)
        r.handleAutorunDependencyChanged(e, t, s);
    }
    handleAutorunStarted(e) {
      for (const t of this.loggers)
        t.handleAutorunStarted(e);
    }
    handleAutorunFinished(e) {
      for (const t of this.loggers)
        t.handleAutorunFinished(e);
    }
    handleDerivedDependencyChanged(e, t, s) {
      for (const r of this.loggers)
        r.handleDerivedDependencyChanged(e, t, s);
    }
    handleDerivedCleared(e) {
      for (const t of this.loggers)
        t.handleDerivedCleared(e);
    }
    handleBeginTransaction(e) {
      for (const t of this.loggers)
        t.handleBeginTransaction(e);
    }
    handleEndTransaction(e) {
      for (const t of this.loggers)
        t.handleEndTransaction(e);
    }
  };
  var u;
  (function(n) {
    let e = false;
    function t() {
      e = true;
    }
    n.enable = t;
    function s() {
      return r(1);
    }
    n.ofCaller = s;
    function r(i) {
      if (!e)
        return;
      const a = Error, d = a.stackTraceLimit;
      a.stackTraceLimit = 3;
      const h = new Error().stack;
      return a.stackTraceLimit = d, j.fromStack(h, i + 1);
    }
    n.ofNthCaller = r;
  })(u || (u = {}));
  var j = class _j {
    static fromStack(e, t) {
      const s = e.split(`
`), r = ue(s[t + 1]);
      if (r)
        return new _j(r.fileName, r.line, r.column, r.id);
    }
    constructor(e, t, s, r) {
      this.fileName = e, this.line = t, this.column = s, this.id = r;
    }
  };
  function ue(n) {
    if (!n)
      return;
    const e = n.match(/\((.*):(\d+):(\d+)\)/);
    if (e)
      return {
        fileName: e[1],
        line: parseInt(e[2]),
        column: parseInt(e[3]),
        id: n
      };
    const t = n.match(/at ([^\(\)]*):(\d+):(\d+)/);
    if (t)
      return {
        fileName: t[1],
        line: parseInt(t[2]),
        column: parseInt(t[3]),
        id: n
      };
  }
  var l = class {
    constructor(e, t, s) {
      this.owner = e, this.debugNameSource = t, this.referenceFn = s;
    }
    getDebugName(e) {
      return he(e, this);
    }
  };
  var P = /* @__PURE__ */ new Map();
  var B = /* @__PURE__ */ new WeakMap();
  function he(n, e) {
    const t = B.get(n);
    if (t)
      return t;
    const s = le(n, e);
    if (s) {
      let r = P.get(s) ?? 0;
      r++, P.set(s, r);
      const i = r === 1 ? s : `${s}#${r}`;
      return B.set(n, i), i;
    }
  }
  function le(n, e) {
    const t = B.get(n);
    if (t)
      return t;
    const s = e.owner ? fe(e.owner) + "." : "";
    let r;
    const i = e.debugNameSource;
    if (i !== void 0)
      if (typeof i == "function") {
        if (r = i(), r !== void 0)
          return s + r;
      } else
        return s + i;
    const a = e.referenceFn;
    if (a !== void 0 && (r = G(a), r !== void 0))
      return s + r;
    if (e.owner !== void 0) {
      const d = ce(e.owner, n);
      if (d !== void 0)
        return s + d;
    }
  }
  function ce(n, e) {
    for (const t in n)
      if (n[t] === e)
        return t;
  }
  var Z = /* @__PURE__ */ new Map();
  var J = /* @__PURE__ */ new WeakMap();
  function fe(n) {
    const e = J.get(n);
    if (e)
      return e;
    const t = ee(n) ?? "Object";
    let s = Z.get(t) ?? 0;
    s++, Z.set(t, s);
    const r = s === 1 ? t : `${t}#${s}`;
    return J.set(n, r), r;
  }
  function ee(n) {
    const e = n.constructor;
    if (e)
      return e.name === "Object" ? void 0 : e.name;
  }
  function G(n) {
    const e = n.toString(), s = /\/\*\*\s*@description\s*([^*]*)\*\//.exec(e);
    return (s ? s[1] : void 0)?.trim();
  }
  var x;
  function ge(n) {
    x = n;
  }
  var te;
  function _e(n) {
    te = n;
  }
  var ne;
  function be(n) {
    ne = n;
  }
  var se;
  function pe(n) {
    se = n;
  }
  var me = class {
    get TChange() {
      return null;
    }
    reportChanges() {
      this.get();
    }
    /** @sealed */
    read(e) {
      return e ? e.readObservable(this) : this.get();
    }
    map(e, t, s = u.ofCaller()) {
      const r = t === void 0 ? void 0 : e, i = t === void 0 ? e : t;
      return x({
        owner: r,
        debugName: () => {
          const a = G(i);
          if (a !== void 0)
            return a;
          const h = /^\s*\(?\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)?\s*=>\s*\1(?:\??)\.([a-zA-Z_$][a-zA-Z_$0-9]*)\s*$/.exec(i.toString());
          if (h)
            return `${this.debugName}.${h[2]}`;
          if (!r)
            return `${this.debugName} (mapped)`;
        },
        debugReferenceFn: i
      }, (a) => i(this.read(a), a), s);
    }
    /**
     * @sealed
     * Converts an observable of an observable value into a direct observable of the value.
    */
    flatten() {
      return x({
        owner: void 0,
        debugName: () => `${this.debugName} (flattened)`
      }, (e) => this.read(e).read(e));
    }
    recomputeInitiallyAndOnChange(e, t) {
      return e.add(te(this, t)), this;
    }
    /**
     * Ensures that this observable is observed. This keeps the cache alive.
     * However, in case of deriveds, it does not force eager evaluation (only when the value is read/get).
     * Use `recomputeInitiallyAndOnChange` for eager evaluation.
     */
    keepObserved(e) {
      return e.add(ne(this)), this;
    }
    get debugValue() {
      return this.get();
    }
    debugGetDependencyGraph() {
      return se(this);
    }
  };
  var R = class extends me {
    constructor(e) {
      super(), this._observers = /* @__PURE__ */ new Set(), o()?.handleObservableCreated(this, e);
    }
    addObserver(e) {
      const t = this._observers.size;
      this._observers.add(e), t === 0 && this.onFirstObserverAdded(), t !== this._observers.size && o()?.handleOnListenerCountChanged(this, this._observers.size);
    }
    removeObserver(e) {
      const t = this._observers.delete(e);
      t && this._observers.size === 0 && this.onLastObserverRemoved(), t && o()?.handleOnListenerCountChanged(this, this._observers.size);
    }
    onFirstObserverAdded() {
    }
    onLastObserverRemoved() {
    }
    log() {
      const e = !!o();
      return oe(this), e || o()?.handleObservableCreated(this, u.ofCaller()), this;
    }
    debugGetObservers() {
      return this._observers;
    }
  };
  function N(n) {
    return {
      dispose: n
    };
  }
  var v = class _v extends Error {
    constructor(e) {
      super(e || "An unexpected bug occurred."), Object.setPrototypeOf(this, _v.prototype);
    }
  };
  function D2(n) {
    throw n;
  }
  function ve(n) {
    console.error("Unexpected error:", n);
  }
  var _ = (n, e) => n === e;
  var f = class {
    constructor() {
      this.disposables = [], this._isDisposed = false;
    }
    get isDisposed() {
      return this._isDisposed;
    }
    dispose() {
      this.clear(), this._isDisposed = true;
    }
    add(e) {
      return e && this.disposables.push(e), e;
    }
    remove(e) {
      if (!e)
        return e;
      const t = this.disposables.indexOf(e);
      return t !== -1 && this.disposables.splice(t, 1), e;
    }
    clear() {
      for (const e of this.disposables)
        e.dispose();
      this.disposables = [];
    }
    leakItems() {
      this.disposables = [];
    }
  };
  var qe = class {
    constructor() {
      this._store = new f();
    }
    dispose() {
      this._store.dispose();
    }
    _register(e) {
      return this._store.add(e), e;
    }
    _registerOrDispose(e) {
      return e && (this._store.isDisposed ? e.dispose() : this._store.add(e)), e;
    }
  };
  function Ce(n) {
    switch (n) {
      case 0:
        return "initial";
      case 1:
        return "dependenciesMightHaveChanged";
      case 2:
        return "stale";
      case 3:
        return "upToDate";
      default:
        return "<unknown>";
    }
  }
  var b = class extends R {
    get debugName() {
      return this._debugNameData.getDebugName(this) ?? "(anonymous)";
    }
    constructor(e, t, s, r = void 0, i, a) {
      super(a), this._debugNameData = e, this._computeFn = t, this._changeTracker = s, this._handleLastObserverRemoved = r, this._equalityComparator = i, this._state = 0, this._value = void 0, this._updateCount = 0, this._dependencies = /* @__PURE__ */ new Set(), this._dependenciesToBeRemoved = /* @__PURE__ */ new Set(), this._changeSummary = void 0, this._isUpdating = false, this._isComputing = false, this._didReportChange = false, this._isInBeforeUpdate = false, this._isReaderValid = false, this._store = void 0, this._delayedStore = void 0, this._removedObserverToCallEndUpdateOn = null, this._changeSummary = this._changeTracker?.createChangeSummary(void 0);
    }
    onLastObserverRemoved() {
      this._state = 0, this._value = void 0, o()?.handleDerivedCleared(this);
      for (const e of this._dependencies)
        e.removeObserver(this);
      this._dependencies.clear(), this._store !== void 0 && (this._store.dispose(), this._store = void 0), this._delayedStore !== void 0 && (this._delayedStore.dispose(), this._delayedStore = void 0), this._handleLastObserverRemoved?.();
    }
    get() {
      if (this._isComputing, this._observers.size === 0) {
        let t;
        try {
          this._isReaderValid = true;
          let s;
          this._changeTracker && (s = this._changeTracker.createChangeSummary(void 0), this._changeTracker.beforeUpdate?.(this, s)), t = this._computeFn(this, s);
        } finally {
          this._isReaderValid = false;
        }
        return this.onLastObserverRemoved(), t;
      } else {
        do {
          if (this._state === 1) {
            for (const t of this._dependencies)
              if (t.reportChanges(), this._state === 2)
                break;
          }
          this._state === 1 && (this._state = 3), this._state !== 3 && this._recompute();
        } while (this._state !== 3);
        return this._value;
      }
    }
    _recompute() {
      let e = false;
      this._isComputing = true, this._didReportChange = false;
      const t = this._dependenciesToBeRemoved;
      this._dependenciesToBeRemoved = this._dependencies, this._dependencies = t;
      try {
        const s = this._changeSummary;
        this._isReaderValid = true, this._changeTracker && (this._isInBeforeUpdate = true, this._changeTracker.beforeUpdate?.(this, s), this._isInBeforeUpdate = false, this._changeSummary = this._changeTracker?.createChangeSummary(s));
        const r = this._state !== 0, i = this._value;
        this._state = 3;
        const a = this._delayedStore;
        a !== void 0 && (this._delayedStore = void 0);
        try {
          this._store !== void 0 && (this._store.dispose(), this._store = void 0), this._value = this._computeFn(this, s);
        } finally {
          this._isReaderValid = false;
          for (const d of this._dependenciesToBeRemoved)
            d.removeObserver(this);
          this._dependenciesToBeRemoved.clear(), a !== void 0 && a.dispose();
        }
        e = this._didReportChange || r && !this._equalityComparator(i, this._value), o()?.handleObservableUpdated(this, {
          oldValue: i,
          newValue: this._value,
          change: void 0,
          didChange: e,
          hadValue: r
        });
      } catch (s) {
        D2(s);
      }
      if (this._isComputing = false, !this._didReportChange && e)
        for (const s of this._observers)
          s.handleChange(this, void 0);
      else
        this._didReportChange = false;
    }
    toString() {
      return `LazyDerived<${this.debugName}>`;
    }
    // IObserver Implementation
    beginUpdate(e) {
      if (this._isUpdating)
        throw new v("Cyclic deriveds are not supported yet!");
      this._updateCount++, this._isUpdating = true;
      try {
        const t = this._updateCount === 1;
        if (this._state === 3 && (this._state = 1, !t))
          for (const s of this._observers)
            s.handlePossibleChange(this);
        if (t)
          for (const s of this._observers)
            s.beginUpdate(this);
      } finally {
        this._isUpdating = false;
      }
    }
    endUpdate(e) {
      if (this._updateCount--, this._updateCount === 0) {
        const t = [...this._observers];
        for (const s of t)
          s.endUpdate(this);
        if (this._removedObserverToCallEndUpdateOn) {
          const s = [...this._removedObserverToCallEndUpdateOn];
          this._removedObserverToCallEndUpdateOn = null;
          for (const r of s)
            r.endUpdate(this);
        }
      }
    }
    handlePossibleChange(e) {
      if (this._state === 3 && this._dependencies.has(e) && !this._dependenciesToBeRemoved.has(e)) {
        this._state = 1;
        for (const t of this._observers)
          t.handlePossibleChange(this);
      }
    }
    handleChange(e, t) {
      if (this._dependencies.has(e) && !this._dependenciesToBeRemoved.has(e) || this._isInBeforeUpdate) {
        o()?.handleDerivedDependencyChanged(this, e, t);
        let s = false;
        try {
          s = this._changeTracker ? this._changeTracker.handleChange({
            changedObservable: e,
            change: t,
            didChange: (i) => i === e
          }, this._changeSummary) : true;
        } catch (i) {
          D2(i);
        }
        const r = this._state === 3;
        if (s && (this._state === 1 || r) && (this._state = 2, r))
          for (const i of this._observers)
            i.handlePossibleChange(this);
      }
    }
    // IReader Implementation
    _ensureReaderValid() {
      if (!this._isReaderValid)
        throw new v("The reader object cannot be used outside its compute function!");
    }
    readObservable(e) {
      this._ensureReaderValid(), e.addObserver(this);
      const t = e.get();
      return this._dependencies.add(e), this._dependenciesToBeRemoved.delete(e), t;
    }
    reportChange(e) {
      this._ensureReaderValid(), this._didReportChange = true;
      for (const t of this._observers)
        t.handleChange(this, e);
    }
    get store() {
      return this._ensureReaderValid(), this._store === void 0 && (this._store = new f()), this._store;
    }
    get delayedStore() {
      return this._ensureReaderValid(), this._delayedStore === void 0 && (this._delayedStore = new f()), this._delayedStore;
    }
    addObserver(e) {
      const t = !this._observers.has(e) && this._updateCount > 0;
      super.addObserver(e), t && (this._removedObserverToCallEndUpdateOn && this._removedObserverToCallEndUpdateOn.has(e) ? this._removedObserverToCallEndUpdateOn.delete(e) : e.beginUpdate(this));
    }
    removeObserver(e) {
      this._observers.has(e) && this._updateCount > 0 && (this._removedObserverToCallEndUpdateOn || (this._removedObserverToCallEndUpdateOn = /* @__PURE__ */ new Set()), this._removedObserverToCallEndUpdateOn.add(e)), super.removeObserver(e);
    }
    debugGetState() {
      return {
        state: this._state,
        stateStr: Ce(this._state),
        updateCount: this._updateCount,
        isComputing: this._isComputing,
        dependencies: this._dependencies,
        value: this._value
      };
    }
    debugSetValue(e) {
      this._value = e;
    }
    debugRecompute() {
      this._isComputing ? this._state = 2 : this._recompute();
    }
    setValue(e, t, s) {
      this._value = e;
      const r = this._observers;
      t.updateObserver(this, this);
      for (const i of r)
        i.handleChange(this, s);
    }
  };
  function Oe(n, e, t = u.ofCaller()) {
    return e !== void 0 ? new b(new l(n, void 0, e), e, void 0, void 0, _, t) : new b(new l(void 0, void 0, n), n, void 0, void 0, _, t);
  }
  function V(n, e, t = u.ofCaller()) {
    return new b(new l(n.owner, n.debugName, n.debugReferenceFn), e, void 0, n.onLastObserverRemoved, n.equalsFn ?? _, t);
  }
  ge(V);
  function we(n) {
    switch (n) {
      case 1:
        return "dependenciesMightHaveChanged";
      case 2:
        return "stale";
      case 3:
        return "upToDate";
      default:
        return "<unknown>";
    }
  }
  var k = class {
    get debugName() {
      return this._debugNameData.getDebugName(this) ?? "(anonymous)";
    }
    constructor(e, t, s, r) {
      this._debugNameData = e, this._runFn = t, this._changeTracker = s, this._state = 2, this._updateCount = 0, this._disposed = false, this._dependencies = /* @__PURE__ */ new Set(), this._dependenciesToBeRemoved = /* @__PURE__ */ new Set(), this._isRunning = false, this._store = void 0, this._delayedStore = void 0, this._changeSummary = this._changeTracker?.createChangeSummary(void 0), o()?.handleAutorunCreated(this, r), this._run();
    }
    dispose() {
      if (!this._disposed) {
        this._disposed = true;
        for (const e of this._dependencies)
          e.removeObserver(this);
        this._dependencies.clear(), this._store !== void 0 && this._store.dispose(), this._delayedStore !== void 0 && this._delayedStore.dispose(), o()?.handleAutorunDisposed(this);
      }
    }
    _run() {
      const e = this._dependenciesToBeRemoved;
      this._dependenciesToBeRemoved = this._dependencies, this._dependencies = e, this._state = 3;
      try {
        if (!this._disposed) {
          o()?.handleAutorunStarted(this);
          const t = this._changeSummary, s = this._delayedStore;
          s !== void 0 && (this._delayedStore = void 0);
          try {
            this._isRunning = true, this._changeTracker && (this._changeTracker.beforeUpdate?.(this, t), this._changeSummary = this._changeTracker.createChangeSummary(t)), this._store !== void 0 && (this._store.dispose(), this._store = void 0), this._runFn(this, t);
          } catch (r) {
            D2(r);
          } finally {
            this._isRunning = false, s !== void 0 && s.dispose();
          }
        }
      } finally {
        this._disposed || o()?.handleAutorunFinished(this);
        for (const t of this._dependenciesToBeRemoved)
          t.removeObserver(this);
        this._dependenciesToBeRemoved.clear();
      }
    }
    toString() {
      return `Autorun<${this.debugName}>`;
    }
    // IObserver implementation
    beginUpdate(e) {
      this._state === 3 && (this._state = 1), this._updateCount++;
    }
    endUpdate(e) {
      try {
        if (this._updateCount === 1)
          do {
            if (this._state === 1) {
              this._state = 3;
              for (const t of this._dependencies)
                if (t.reportChanges(), this._state === 2)
                  break;
            }
            this._state !== 3 && this._run();
          } while (this._state !== 3);
      } finally {
        this._updateCount--;
      }
    }
    handlePossibleChange(e) {
      this._state === 3 && this._isDependency(e) && (this._state = 1);
    }
    handleChange(e, t) {
      if (this._isDependency(e)) {
        o()?.handleAutorunDependencyChanged(this, e, t);
        try {
          (this._changeTracker ? this._changeTracker.handleChange({
            changedObservable: e,
            change: t,
            didChange: (r) => r === e
          }, this._changeSummary) : true) && (this._state = 2);
        } catch (s) {
          D2(s);
        }
      }
    }
    _isDependency(e) {
      return this._dependencies.has(e) && !this._dependenciesToBeRemoved.has(e);
    }
    // IReader implementation
    _ensureNoRunning() {
      if (!this._isRunning)
        throw new v("The reader object cannot be used outside its compute function!");
    }
    readObservable(e) {
      if (this._ensureNoRunning(), this._disposed)
        return e.get();
      e.addObserver(this);
      const t = e.get();
      return this._dependencies.add(e), this._dependenciesToBeRemoved.delete(e), t;
    }
    get store() {
      if (this._ensureNoRunning(), this._disposed)
        throw new v("Cannot access store after dispose");
      return this._store === void 0 && (this._store = new f()), this._store;
    }
    get delayedStore() {
      if (this._ensureNoRunning(), this._disposed)
        throw new v("Cannot access store after dispose");
      return this._delayedStore === void 0 && (this._delayedStore = new f()), this._delayedStore;
    }
    debugGetState() {
      return {
        isRunning: this._isRunning,
        updateCount: this._updateCount,
        dependencies: this._dependencies,
        state: this._state,
        stateStr: we(this._state)
      };
    }
    debugRerun() {
      this._isRunning ? this._state = 2 : this._run();
    }
  };
  function L(n, e = u.ofCaller()) {
    return new k(new l(void 0, void 0, n), n, void 0, e);
  }
  function Se(n, e, t = u.ofCaller()) {
    return new k(new l(n.owner, n.debugName, n.debugReferenceFn ?? e), e, n.changeTracker, t);
  }
  function Te(n, e) {
    const t = new f(), s = Se({
      owner: n.owner,
      debugName: n.debugName,
      debugReferenceFn: n.debugReferenceFn ?? e,
      changeTracker: n.changeTracker
    }, (r, i) => {
      t.clear(), e(r, i, t);
    });
    return N(() => {
      s.dispose(), t.dispose();
    });
  }
  function Q(n) {
    const e = new Error("BugIndicatingErrorRecovery: " + n);
    ve(e), console.error("recovered from an error that indicates a bug", e);
  }
  function A(n, e) {
    const t = new U(n, e);
    try {
      n(t);
    } finally {
      t.finish();
    }
  }
  function De(n, e, t) {
    n ? e(n) : A(e, t);
  }
  var U = class {
    constructor(e, t) {
      this._fn = e, this._getDebugName = t, this._updatingObservers = [], o()?.handleBeginTransaction(this);
    }
    getDebugName() {
      return this._getDebugName ? this._getDebugName() : G(this._fn);
    }
    updateObserver(e, t) {
      if (!this._updatingObservers) {
        Q("Transaction already finished!"), A((s) => {
          s.updateObserver(e, t);
        });
        return;
      }
      this._updatingObservers.push({ observer: e, observable: t }), e.beginUpdate(t);
    }
    finish() {
      const e = this._updatingObservers;
      if (!e) {
        Q("transaction.finish() has already been called!");
        return;
      }
      for (let t = 0; t < e.length; t++) {
        const { observer: s, observable: r } = e[t];
        s.endUpdate(r);
      }
      this._updatingObservers = null, o()?.handleEndTransaction(this);
    }
    debugGetUpdatingObservers() {
      return this._updatingObservers;
    }
  };
  function z(n, e, t = u.ofCaller()) {
    let s;
    return typeof n == "string" ? s = new l(void 0, n, void 0) : s = new l(n, void 0, void 0), new q(s, e, _, t);
  }
  var q = class extends R {
    get debugName() {
      return this._debugNameData.getDebugName(this) ?? "ObservableValue";
    }
    constructor(e, t, s, r) {
      super(r), this._debugNameData = e, this._equalityComparator = s, this._value = t, o()?.handleObservableUpdated(this, { hadValue: false, newValue: t, change: void 0, didChange: true, oldValue: void 0 });
    }
    get() {
      return this._value;
    }
    set(e, t, s) {
      if (s === void 0 && this._equalityComparator(this._value, e))
        return;
      let r;
      t || (t = r = new U(() => {
      }, () => `Setting ${this.debugName}`));
      try {
        const i = this._value;
        this._setValue(e), o()?.handleObservableUpdated(this, { oldValue: i, newValue: e, change: s, didChange: true, hadValue: true });
        for (const a of this._observers)
          t.updateObserver(a, this), a.handleChange(this, s);
      } finally {
        r && r.finish();
      }
    }
    toString() {
      return `${this.debugName}: ${this._value}`;
    }
    _setValue(e) {
      this._value = e;
    }
    debugGetState() {
      return {
        value: this._value
      };
    }
    debugSetValue(e) {
      this._value = e;
    }
  };
  function I(...n) {
    let e, t, s, r;
    return n.length === 2 ? [t, s] = n : [e, t, s, r] = n, new p(new l(e, void 0, s), t, s, () => p.globalTransaction, _, r ?? u.ofCaller());
  }
  var p = class extends R {
    constructor(e, t, s, r, i, a) {
      super(a), this._debugNameData = e, this.event = t, this._getValue = s, this._getTransaction = r, this._equalityComparator = i, this._hasValue = false, this.handleEvent = (d) => {
        const h = this._getValue(d), $2 = this._value, E2 = !this._hasValue || !this._equalityComparator($2, h);
        let M2 = false;
        E2 && (this._value = h, this._hasValue && (M2 = true, De(this._getTransaction(), (w) => {
          o()?.handleObservableUpdated(this, { oldValue: $2, newValue: h, change: void 0, didChange: E2, hadValue: this._hasValue });
          for (const H2 of this._observers)
            w.updateObserver(H2, this), H2.handleChange(this, void 0);
        }, () => {
          const w = this.getDebugName();
          return "Event fired" + (w ? `: ${w}` : "");
        })), this._hasValue = true), M2 || o()?.handleObservableUpdated(this, { oldValue: $2, newValue: h, change: void 0, didChange: E2, hadValue: this._hasValue });
      };
    }
    getDebugName() {
      return this._debugNameData.getDebugName(this);
    }
    get debugName() {
      const e = this.getDebugName();
      return "From Event" + (e ? `: ${e}` : "");
    }
    onFirstObserverAdded() {
      this._subscription = this.event(this.handleEvent);
    }
    onLastObserverRemoved() {
      this._subscription.dispose(), this._subscription = void 0, this._hasValue = false, this._value = void 0;
    }
    get() {
      return this._subscription ? (this._hasValue || this.handleEvent(void 0), this._value) : this._getValue(void 0);
    }
    debugSetValue(e) {
      this._value = e;
    }
    debugGetState() {
      return { value: this._value, hasValue: this._hasValue };
    }
  };
  (function(n) {
    n.Observer = p;
    function e(t, s) {
      let r = false;
      p.globalTransaction === void 0 && (p.globalTransaction = t, r = true);
      try {
        s();
      } finally {
        r && (p.globalTransaction = void 0);
      }
    }
    n.batchEventsGlobally = e;
  })(I || (I = {}));
  function Ve(n) {
    const e = new re(false, void 0);
    return n.addObserver(e), N(() => {
      n.removeObserver(e);
    });
  }
  be(Ve);
  function ke(n, e) {
    const t = new re(true, e);
    n.addObserver(t);
    try {
      t.beginUpdate(n);
    } finally {
      t.endUpdate(n);
    }
    return N(() => {
      n.removeObserver(t);
    });
  }
  _e(ke);
  var re = class {
    constructor(e, t) {
      this._forceRecompute = e, this._handleValue = t, this._counter = 0;
    }
    beginUpdate(e) {
      this._counter++;
    }
    endUpdate(e) {
      this._counter === 1 && this._forceRecompute && (this._handleValue ? this._handleValue(e.get()) : e.reportChanges()), this._counter--;
    }
    handlePossibleChange(e) {
    }
    handleChange(e, t) {
    }
  };
  var T2;
  function Ae(n) {
    T2 || (T2 = new Ue(), ae(T2)), T2.addFilteredObj(n);
  }
  var Ue = class {
    constructor() {
      this.indentation = 0, this.changedObservablesSets = /* @__PURE__ */ new WeakMap();
    }
    addFilteredObj(e) {
      this._filteredObjects || (this._filteredObjects = /* @__PURE__ */ new Set()), this._filteredObjects.add(e);
    }
    _isIncluded(e) {
      return this._filteredObjects?.has(e) ?? true;
    }
    textToConsoleArgs(e) {
      return $e([
        C(xe("|  ", this.indentation)),
        e
      ]);
    }
    formatInfo(e) {
      return e.hadValue ? e.didChange ? [
        C(" "),
        c(O(e.oldValue, 70), {
          color: "red",
          strikeThrough: true
        }),
        C(" "),
        c(O(e.newValue, 60), {
          color: "green"
        })
      ] : [C(" (unchanged)")] : [
        C(" "),
        c(O(e.newValue, 60), {
          color: "green"
        }),
        C(" (initial)")
      ];
    }
    handleObservableCreated(e) {
      if (e instanceof b) {
        const t = e;
        this.changedObservablesSets.set(t, /* @__PURE__ */ new Set());
      }
    }
    handleOnListenerCountChanged(e, t) {
    }
    handleObservableUpdated(e, t) {
      if (this._isIncluded(e)) {
        if (e instanceof b) {
          this._handleDerivedRecomputed(e, t);
          return;
        }
        console.log(...this.textToConsoleArgs([
          y("observable value changed"),
          c(e.debugName, { color: "BlueViolet" }),
          ...this.formatInfo(t)
        ]));
      }
    }
    formatChanges(e) {
      if (e.size !== 0)
        return c(" (changed deps: " + [...e].map((t) => t.debugName).join(", ") + ")", { color: "gray" });
    }
    handleDerivedDependencyChanged(e, t, s) {
      this._isIncluded(e) && this.changedObservablesSets.get(e)?.add(t);
    }
    _handleDerivedRecomputed(e, t) {
      if (!this._isIncluded(e))
        return;
      const s = this.changedObservablesSets.get(e);
      s && (console.log(...this.textToConsoleArgs([
        y("derived recomputed"),
        c(e.debugName, { color: "BlueViolet" }),
        ...this.formatInfo(t),
        this.formatChanges(s),
        { data: [{ fn: e._debugNameData.referenceFn ?? e._computeFn }] }
      ])), s.clear());
    }
    handleDerivedCleared(e) {
      this._isIncluded(e) && console.log(...this.textToConsoleArgs([
        y("derived cleared"),
        c(e.debugName, { color: "BlueViolet" })
      ]));
    }
    handleFromEventObservableTriggered(e, t) {
      this._isIncluded(e) && console.log(...this.textToConsoleArgs([
        y("observable from event triggered"),
        c(e.debugName, { color: "BlueViolet" }),
        ...this.formatInfo(t),
        { data: [{ fn: e._getValue }] }
      ]));
    }
    handleAutorunCreated(e) {
      this._isIncluded(e) && this.changedObservablesSets.set(e, /* @__PURE__ */ new Set());
    }
    handleAutorunDisposed(e) {
    }
    handleAutorunDependencyChanged(e, t, s) {
      this._isIncluded(e) && this.changedObservablesSets.get(e).add(t);
    }
    handleAutorunStarted(e) {
      const t = this.changedObservablesSets.get(e);
      t && (this._isIncluded(e) && console.log(...this.textToConsoleArgs([
        y("autorun"),
        c(e.debugName, { color: "BlueViolet" }),
        this.formatChanges(t),
        { data: [{ fn: e._debugNameData.referenceFn ?? e._runFn }] }
      ])), t.clear(), this.indentation++);
    }
    handleAutorunFinished(e) {
      this.indentation--;
    }
    handleBeginTransaction(e) {
      let t = e.getDebugName();
      t === void 0 && (t = ""), this._isIncluded(e) && console.log(...this.textToConsoleArgs([
        y("transaction"),
        c(t, { color: "BlueViolet" }),
        { data: [{ fn: e._fn }] }
      ])), this.indentation++;
    }
    handleEndTransaction() {
      this.indentation--;
    }
  };
  function $e(n) {
    const e = new Array(), t = [];
    let s = "";
    function r(a) {
      if ("length" in a)
        for (const d of a)
          d && r(d);
      else "text" in a ? (s += `%c${a.text}`, e.push(a.style), a.data && t.push(...a.data)) : "data" in a && t.push(...a.data);
    }
    r(n);
    const i = [s, ...e];
    return i.push(...t), i;
  }
  function C(n) {
    return c(n, { color: "black" });
  }
  function y(n) {
    return c(Ie(`${n}: `, 10), { color: "black", bold: true });
  }
  function c(n, e = {
    color: "black"
  }) {
    function t(r) {
      return Object.entries(r).reduce((i, [a, d]) => `${i}${a}:${d};`, "");
    }
    const s = {
      color: e.color
    };
    return e.strikeThrough && (s["text-decoration"] = "line-through"), e.bold && (s["font-weight"] = "bold"), {
      text: n,
      style: t(s)
    };
  }
  function O(n, e) {
    try {
      return Ee(n, e);
    } catch {
      return "[[???]]";
    }
  }
  function Ee(n, e) {
    switch (typeof n) {
      case "number":
        return "" + n;
      case "string":
        return n.length + 2 <= e ? `"${n}"` : `"${n.substr(0, e - 7)}"+...`;
      case "boolean":
        return n ? "true" : "false";
      case "undefined":
        return "undefined";
      case "object":
        return n === null ? "null" : Array.isArray(n) ? Fe(n, e) : Be(n, e);
      case "symbol":
        return n.toString();
      case "function":
        return `[[Function${n.name ? " " + n.name : ""}]]`;
      default:
        return "" + n;
    }
  }
  function Fe(n, e) {
    let t = "[ ", s = true;
    for (const r of n) {
      if (s || (t += ", "), t.length - 5 > e) {
        t += "...";
        break;
      }
      s = false, t += `${O(r, e - t.length)}`;
    }
    return t += " ]", t;
  }
  function Be(n, e) {
    try {
      if (typeof n.toString == "function" && n.toString !== Object.prototype.toString) {
        const a = n.toString();
        return a.length <= e ? a : a.substring(0, e - 3) + "...";
      }
    } catch {
      return "[[Object]]";
    }
    const t = ee(n);
    let s = t ? t + "(" : "{ ", r = true, i;
    try {
      i = Object.entries(n);
    } catch {
      return t ? `${t}(...)` : "[[Object]]";
    }
    for (const [a, d] of i) {
      if (r || (s += ", "), s.length - 5 > e) {
        s += "...";
        break;
      }
      r = false, s += `${a}: ${O(d, e - s.length)}`;
    }
    return s += t ? ")" : " }", s;
  }
  function xe(n, e) {
    let t = "";
    for (let s = 1; s <= e; s++)
      t += n;
    return t;
  }
  function Ie(n, e) {
    for (; n.length < e; )
      n += " ";
    return n;
  }
  function je(n, e) {
    const t = e?.debugNamePostProcessor ?? ((i) => i), s = g.from(n, t);
    return s ? ie(s, 0, /* @__PURE__ */ new Set()).trim() : "";
  }
  function ie(n, e, t) {
    const s = "		".repeat(e), r = [];
    if (t.has(n.sourceObj))
      return r.push(`${s}* ${n.type} ${n.name} (already listed)`), r.join(`
`);
    if (t.add(n.sourceObj), r.push(`${s}* ${n.type} ${n.name}:`), r.push(`${s}  value: ${O(n.value, 50)}`), r.push(`${s}  state: ${n.state}`), n.dependencies.length > 0) {
      r.push(`${s}  dependencies:`);
      for (const a of n.dependencies)
        r.push(ie(a, e + 1, t));
    }
    return r.join(`
`);
  }
  var g = class _g {
    static from(e, t) {
      if (e instanceof k) {
        const s = e.debugGetState();
        return new _g(e, t(e.debugName), "autorun", void 0, s.stateStr, Array.from(s.dependencies).map((r) => _g.from(r, t) || _g.unknown(r)));
      } else if (e instanceof b) {
        const s = e.debugGetState();
        return new _g(e, t(e.debugName), "derived", s.value, s.stateStr, Array.from(s.dependencies).map((r) => _g.from(r, t) || _g.unknown(r)));
      } else if (e instanceof q) {
        const s = e.debugGetState();
        return new _g(e, t(e.debugName), "observableValue", s.value, "upToDate", []);
      } else if (e instanceof p) {
        const s = e.debugGetState();
        return new _g(e, t(e.debugName), "fromEvent", s.value, s.hasValue ? "upToDate" : "initial", []);
      }
    }
    static unknown(e) {
      return new _g(e, "(unknown)", "unknown", void 0, "unknown", []);
    }
    constructor(e, t, s, r, i, a) {
      this.sourceObj = e, this.name = t, this.type = s, this.value = r, this.state = i, this.dependencies = a;
    }
  };
  pe(je);
  de(Ae);
  function We(n, e) {
    let t, s = true;
    return Te({
      changeTracker: {
        createChangeSummary: () => ({ deltas: [], didChange: false }),
        handleChange: (r, i) => {
          if (r.didChange(n)) {
            const a = r.change;
            a !== void 0 && i.deltas.push(a), i.didChange = true;
          }
          return true;
        }
      }
    }, (r, i) => {
      const a = n.read(r), d = t;
      i.didChange && (t = a, e(a, d, i.deltas)), s && (s = false, t = a);
    });
  }

  // node_modules/@vscode/markdown-editor/dist/index.js
  var _2 = class __ {
    constructor(e, t) {
      if (this.start = e, this.endExclusive = t, e > t)
        throw new Error(`Invalid range: [${e}, ${t})`);
    }
    static fromTo(e, t) {
      return new __(e, t);
    }
    static ofLength(e) {
      return new __(0, e);
    }
    static ofStartAndLength(e, t) {
      return new __(e, e + t);
    }
    static emptyAt(e) {
      return new __(e, e);
    }
    get isEmpty() {
      return this.start === this.endExclusive;
    }
    get length() {
      return this.endExclusive - this.start;
    }
    delta(e) {
      return new __(this.start + e, this.endExclusive + e);
    }
    deltaStart(e) {
      return new __(this.start + e, this.endExclusive);
    }
    deltaEnd(e) {
      return new __(this.start, this.endExclusive + e);
    }
    contains(e) {
      return this.start <= e && e < this.endExclusive;
    }
    containsRange(e) {
      return this.start <= e.start && e.endExclusive <= this.endExclusive;
    }
    intersects(e) {
      return Math.max(this.start, e.start) < Math.min(this.endExclusive, e.endExclusive);
    }
    intersectsOrTouches(e) {
      return Math.max(this.start, e.start) <= Math.min(this.endExclusive, e.endExclusive);
    }
    intersect(e) {
      const t = Math.max(this.start, e.start), s = Math.min(this.endExclusive, e.endExclusive);
      if (t <= s)
        return new __(t, s);
    }
    join(e) {
      return new __(
        Math.min(this.start, e.start),
        Math.max(this.endExclusive, e.endExclusive)
      );
    }
    isBefore(e) {
      return this.endExclusive <= e.start;
    }
    isAfter(e) {
      return this.start >= e.endExclusive;
    }
    substring(e) {
      return e.substring(this.start, this.endExclusive);
    }
    slice(e) {
      return e.slice(this.start, this.endExclusive);
    }
    equals(e) {
      return this.start === e.start && this.endExclusive === e.endExclusive;
    }
    toString() {
      return `[${this.start}, ${this.endExclusive})`;
    }
  };
  var V2 = class _V {
    constructor(e, t) {
      this.replaceRange = e, this.newText = t;
    }
    static insert(e, t) {
      return new _V(_2.emptyAt(e), t);
    }
    static replace(e, t) {
      return new _V(e, t);
    }
    static delete(e) {
      return new _V(e, "");
    }
    get isEmpty() {
      return this.replaceRange.isEmpty && this.newText.length === 0;
    }
    equals(e) {
      return this.replaceRange.equals(e.replaceRange) && this.newText === e.newText;
    }
    toString() {
      return `${this.replaceRange} -> ${JSON.stringify(this.newText)}`;
    }
  };
  var _y = class _y {
    constructor(e) {
      __publicField(this, "replacements");
      let t = -1;
      for (const s of e) {
        if (s.replaceRange.start < t)
          throw new Error(
            `Edits must be disjoint and sorted. Found ${s} after ${t}`
          );
        t = s.replaceRange.endExclusive;
      }
      this.replacements = e;
    }
    static single(e) {
      return new _y([e]);
    }
    static replace(e, t) {
      return new _y([V2.replace(e, t)]);
    }
    static insert(e, t) {
      return new _y([V2.insert(e, t)]);
    }
    static delete(e) {
      return new _y([V2.delete(e)]);
    }
    get isEmpty() {
      return this.replacements.length === 0;
    }
    apply(e) {
      const t = [];
      let s = 0;
      for (const i of this.replacements)
        t.push(e.substring(s, i.replaceRange.start)), t.push(i.newText), s = i.replaceRange.endExclusive;
      return t.push(e.substring(s)), t.join("");
    }
    inverse(e) {
      const t = [];
      let s = 0;
      for (const i of this.replacements) {
        const r = e.substring(i.replaceRange.start, i.replaceRange.endExclusive);
        t.push(
          V2.replace(
            _2.ofStartAndLength(i.replaceRange.start + s, i.newText.length),
            r
          )
        ), s += i.newText.length - i.replaceRange.length;
      }
      return new _y(t);
    }
    equals(e) {
      if (this.replacements.length !== e.replacements.length)
        return false;
      for (let t = 0; t < this.replacements.length; t++)
        if (!this.replacements[t].equals(e.replacements[t]))
          return false;
      return true;
    }
    mapOffset(e) {
      let t = 0;
      for (const s of this.replacements) {
        if (s.replaceRange.start > e)
          break;
        if (s.replaceRange.endExclusive <= e)
          t += s.newText.length - s.replaceRange.length;
        else
          return s.replaceRange.start + t + s.newText.length;
      }
      return e + t;
    }
    toString() {
      return `[${this.replacements.map((e) => e.toString()).join(", ")}]`;
    }
  };
  __publicField(_y, "empty", new _y([]));
  var y2 = _y;
  var Ie2 = class _Ie {
    constructor(e, t) {
      if (this.replaceRange = e, this.newLength = t, t < 0)
        throw new Error(`newLength must be non-negative, got ${t}`);
    }
    static replace(e, t) {
      return new _Ie(e, t);
    }
    get lengthDelta() {
      return this.newLength - this.replaceRange.length;
    }
    equals(e) {
      return this.replaceRange.equals(e.replaceRange) && this.newLength === e.newLength;
    }
    toString() {
      return `${this.replaceRange} -> +${this.newLength}`;
    }
  };
  var _J = class _J {
    constructor(e) {
      __publicField(this, "replacements");
      let t = -1;
      for (const s of e) {
        if (s.replaceRange.start < t)
          throw new Error(`Edits must be disjoint and sorted. Found ${s} after end ${t}`);
        t = s.replaceRange.endExclusive;
      }
      this.replacements = e;
    }
    static single(e) {
      return new _J([e]);
    }
    static replace(e, t) {
      return new _J([Ie2.replace(e, t)]);
    }
    get isEmpty() {
      return this.replacements.length === 0;
    }
    equals(e) {
      if (this.replacements.length !== e.replacements.length)
        return false;
      for (let t = 0; t < this.replacements.length; t++)
        if (!this.replacements[t].equals(e.replacements[t]))
          return false;
      return true;
    }
    toString() {
      return this.isEmpty ? "LengthEdit.empty" : this.replacements.join(", ");
    }
  };
  __publicField(_J, "empty", new _J([]));
  var J2 = _J;
  var Oe2 = class {
    constructor(e) {
      this.value = e;
    }
    get length() {
      return this.value.length;
    }
    substring(e) {
      return e.substring(this.value);
    }
    toString() {
      return this.value;
    }
  };
  var x2 = class _x {
    constructor(e, t) {
      this.anchor = e, this.active = t;
    }
    static collapsed(e) {
      return new _x(e, e);
    }
    get isCollapsed() {
      return this.anchor === this.active;
    }
    get isForward() {
      return this.active >= this.anchor;
    }
    get range() {
      return this.isForward ? new _2(this.anchor, this.active) : new _2(this.active, this.anchor);
    }
    collapseToActive() {
      return _x.collapsed(this.active);
    }
    withActive(e) {
      return new _x(this.anchor, e);
    }
  };
  var _ee = class _ee {
    constructor(e, t) {
      this.x = e, this.y = t;
    }
    translate(e, t) {
      return new _ee(this.x + e, this.y + t);
    }
  };
  __publicField(_ee, "ZERO", new _ee(0, 0));
  var ee2 = _ee;
  var _R = class _R {
    constructor(e, t, s, i) {
      this.x = e, this.y = t, this.width = s, this.height = i;
    }
    static fromPointPoint(e, t, s, i) {
      return new _R(e, t, s - e, i - t);
    }
    static fromPointSize(e, t, s, i) {
      return new _R(e, t, s, i);
    }
    get left() {
      return this.x;
    }
    get top() {
      return this.y;
    }
    get right() {
      return this.x + this.width;
    }
    get bottom() {
      return this.y + this.height;
    }
    get topLeft() {
      return new ee2(this.x, this.y);
    }
    containsX(e) {
      return e >= this.left && e < this.right;
    }
    containsY(e) {
      return e >= this.top && e < this.bottom;
    }
    containsPoint(e) {
      return this.containsX(e.x) && this.containsY(e.y);
    }
    /** Same y/height, zero-width band at `x = this.left`. Useful for caret rects derived from a line. */
    withZeroWidthAt(e) {
      return new _R(e, this.y, 0, this.height);
    }
    translate(e, t) {
      return new _R(this.x + e, this.y + t, this.width, this.height);
    }
  };
  __publicField(_R, "EMPTY", new _R(0, 0, 0, 0));
  var R2 = _R;
  function It(n, e) {
    if (e <= 0)
      return 0;
    let t = e - 1;
    for (; t > 0 && /\s/.test(n[t]); )
      t--;
    if (t >= 0 && /\w/.test(n[t]))
      for (; t > 0 && /\w/.test(n[t - 1]); )
        t--;
    else if (t >= 0)
      for (; t > 0 && !/\w/.test(n[t - 1]) && !/\s/.test(n[t - 1]); )
        t--;
    return t;
  }
  function Bt(n, e) {
    const t = n.length;
    if (e >= t)
      return t;
    let s = e;
    for (; s < t && /\s/.test(n[s]); )
      s++;
    if (s < t && /\w/.test(n[s]))
      for (; s < t && /\w/.test(n[s]); )
        s++;
    else if (s < t)
      for (; s < t && !/\w/.test(n[s]) && !/\s/.test(n[s]); )
        s++;
    return s;
  }
  function hn(n, e) {
    if (e >= n.length)
      return { start: n.length, end: n.length };
    const t = n[e];
    if (/\w/.test(t)) {
      let r = e, o2 = e;
      for (; r > 0 && /\w/.test(n[r - 1]); )
        r--;
      for (; o2 < n.length && /\w/.test(n[o2]); )
        o2++;
      return { start: r, end: o2 };
    }
    if (/\s/.test(t)) {
      let r = e, o2 = e;
      for (; r > 0 && /\s/.test(n[r - 1]); )
        r--;
      for (; o2 < n.length && /\s/.test(n[o2]); )
        o2++;
      return { start: r, end: o2 };
    }
    let s = e, i = e;
    for (; s > 0 && !/\w/.test(n[s - 1]) && !/\s/.test(n[s - 1]); )
      s--;
    for (; i < n.length && !/\w/.test(n[i]) && !/\s/.test(n[i]); )
      i++;
    return { start: s, end: i };
  }
  var un = 1;
  var E = class {
    constructor() {
      /**
       * A stable identity. Every node has one: it is minted on construction and
       * carried across edits by reconciliation, so a node that survives an edit
       * (even with changed content) keeps the same id.
       */
      __publicField(this, "id", un++);
      __publicField(this, "_length", -1);
    }
    get length() {
      if (this._length < 0) {
        let e = 0;
        for (const t of this.children)
          e += t.length;
        this._length = e;
      }
      return this._length;
    }
    /**
     * True when `other` has the same content. Containers compare children *by
     * identity* (`===`): bottom-up reconciliation substitutes reused old
     * instances into the fresh tree first, so equal children already share
     * instances — keeping this O(children), not O(subtree). Leaves have no
     * children, so {@link _localEquals} is their whole comparison.
     */
    structurallyEqual(e) {
      if (this === e)
        return true;
      if (this.kind !== e.kind || this.length !== e.length || !this._localEquals(e))
        return false;
      const t = this.children, s = e.children;
      if (t.length !== s.length)
        return false;
      for (let i = 0; i < t.length; i++)
        if (t[i] !== s[i])
          return false;
      return true;
    }
    /** Compares only this node's own scalar fields (kind/length already match). */
    _localEquals(e) {
      return true;
    }
    /**
     * A copy of this node that adopts `id`. Reconciliation uses this to carry an
     * old identity onto a node whose content changed. Nodes are immutable value
     * holders, so a shallow prototype copy with `id` overridden is sound.
     */
    cloneWithId(e) {
      const t = Object.create(Object.getPrototypeOf(this));
      return Object.assign(t, this), t.id = e, t;
    }
  };
  var dn = [];
  function O2(n, e) {
    let t;
    for (let s = 0; s < e.length; s++) {
      const i = n.get(e[s]);
      i && i !== e[s] && ((t ?? (t = e.slice()))[s] = i);
    }
    return t ?? e;
  }
  function P2(n, e) {
    const t = n.get(e);
    return t && t !== e ? t : e;
  }
  var Ee2 = class extends E {
    get children() {
      return dn;
    }
    get length() {
      return this.content.length;
    }
    mapChildren() {
      return this;
    }
  };
  var ve2 = class extends Ee2 {
    constructor(e) {
      super();
      __publicField(this, "kind", "text");
      this.content = e;
    }
    _localEquals(e) {
      return this.content === e.content;
    }
  };
  var k2 = class extends Ee2 {
    constructor(e, t) {
      super();
      __publicField(this, "kind", "marker");
      this.markerKind = e, this.content = t;
    }
    _localEquals(e) {
      return this.markerKind === e.markerKind && this.content === e.content;
    }
  };
  var N2 = class extends Ee2 {
    constructor(e, t) {
      super();
      __publicField(this, "kind", "glue");
      this.content = e, this.glueKind = t;
    }
    _localEquals(e) {
      return this.content === e.content && this.glueKind === e.glueKind;
    }
  };
  var ne2 = class _ne extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "thematicBreak");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get marker() {
      return le2(this.content, "content");
    }
    mapChildren(e) {
      return new _ne(O2(e, this.content));
    }
  };
  function le2(n, e) {
    return n.find((t) => t instanceof k2 && t.markerKind === e);
  }
  var Be2 = class _Be extends E {
    constructor(e, t, s) {
      super();
      __publicField(this, "kind", "strong");
      this.openMarker = e, this.content = t, this.closeMarker = s;
    }
    get children() {
      return [this.openMarker, ...this.content, this.closeMarker];
    }
    mapChildren(e) {
      return new _Be(P2(e, this.openMarker), O2(e, this.content), P2(e, this.closeMarker));
    }
  };
  var Re = class _Re extends E {
    constructor(e, t, s) {
      super();
      __publicField(this, "kind", "emphasis");
      this.openMarker = e, this.content = t, this.closeMarker = s;
    }
    get children() {
      return [this.openMarker, ...this.content, this.closeMarker];
    }
    mapChildren(e) {
      return new _Re(P2(e, this.openMarker), O2(e, this.content), P2(e, this.closeMarker));
    }
  };
  var De2 = class _De extends E {
    constructor(e, t, s) {
      super();
      __publicField(this, "kind", "strikethrough");
      this.openMarker = e, this.content = t, this.closeMarker = s;
    }
    get children() {
      return [this.openMarker, ...this.content, this.closeMarker];
    }
    mapChildren(e) {
      return new _De(P2(e, this.openMarker), O2(e, this.content), P2(e, this.closeMarker));
    }
  };
  var Ae2 = class _Ae extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "inlineCode");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _Ae(O2(e, this.content));
    }
  };
  var $e2 = class _$e extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "inlineMath");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _$e(O2(e, this.content));
    }
  };
  var fe2 = class _fe extends E {
    constructor(e, t) {
      super();
      __publicField(this, "kind", "link");
      this.url = e, this.content = t;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _fe(this.url, O2(e, this.content));
    }
    _localEquals(e) {
      return this.url === e.url;
    }
  };
  var ge2 = class _ge extends E {
    constructor(e, t, s) {
      super();
      __publicField(this, "kind", "image");
      this.alt = e, this.url = t, this.content = s;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _ge(this.alt, this.url, O2(e, this.content));
    }
    _localEquals(e) {
      return this.alt === e.alt && this.url === e.url;
    }
  };
  var U2 = class _U extends E {
    constructor(e, t, s) {
      super();
      __publicField(this, "kind", "heading");
      this.level = e, this.marker = t, this.content = s;
    }
    get children() {
      return [this.marker, ...this.content];
    }
    mapChildren(e) {
      return new _U(this.level, P2(e, this.marker), O2(e, this.content));
    }
    _localEquals(e) {
      return this.level === e.level;
    }
  };
  var z2 = class _z extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "paragraph");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _z(O2(e, this.content));
    }
  };
  var K2 = class _K extends E {
    constructor(e, t) {
      super();
      __publicField(this, "kind", "codeBlock");
      __publicField(this, "_previous");
      __publicField(this, "_contentEdit");
      this.language = e, this.content = t;
    }
    get children() {
      return this.content;
    }
    get openFence() {
      return le2(this.content, "openFence");
    }
    get closeFence() {
      return le2(this.content, "closeFence");
    }
    get code() {
      return le2(this.content, "content");
    }
    /** Relative start offset of the {@link code} marker within this block. */
    get codeOffset() {
      let e = 0;
      for (const t of this.content) {
        if (t.kind === "marker" && t.markerKind === "content")
          return e;
        e += t.length;
      }
      return e;
    }
    mapChildren(e) {
      return new _K(this.language, O2(e, this.content));
    }
    _localEquals(e) {
      return this.language === e.language;
    }
    /**
     * A copy of this block carrying an incremental link to `previous`:
     * `contentEdit` (in the block's *content* coordinates) turns `previous`'s
     * content into this one. Uses a weak reference so the previous tree can be
     * garbage-collected.
     */
    withCodeDiff(e, t) {
      const s = this.cloneWithId(this.id);
      return s._previous = new WeakRef(e), s._contentEdit = t, s;
    }
    /**
     * When this block was incrementally derived from `previous` (same
     * fences/language, edit entirely within the content), returns the
     * content-coordinate edit; otherwise `undefined`.
     */
    getDiff(e) {
      if (this._contentEdit && this._previous?.deref() === e)
        return { stringEdit: this._contentEdit };
    }
  };
  var se2 = class _se extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "mathBlock");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get code() {
      return le2(this.content, "content");
    }
    mapChildren(e) {
      return new _se(O2(e, this.content));
    }
  };
  var pe2 = class _pe extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "blockQuote");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get blocks() {
      return this.content.filter(Ve2);
    }
    mapChildren(e) {
      return new _pe(O2(e, this.content));
    }
  };
  var H = class _H extends E {
    constructor(e, t) {
      super();
      __publicField(this, "kind", "list");
      this.ordered = e, this.content = t;
    }
    get children() {
      return this.content;
    }
    get items() {
      return this.content.filter((e) => e instanceof $);
    }
    mapChildren(e) {
      return new _H(this.ordered, O2(e, this.content));
    }
    _localEquals(e) {
      return this.ordered === e.ordered;
    }
  };
  var $ = class _$ extends E {
    constructor(e, t, s, i) {
      super();
      __publicField(this, "kind", "listItem");
      this.marker = e, this.content = t, this.checked = s, this.leadingTrivia = i;
    }
    get children() {
      return this.leadingTrivia ? [this.leadingTrivia, this.marker, ...this.content] : [this.marker, ...this.content];
    }
    get blocks() {
      return this.content.filter(Ve2);
    }
    mapChildren(e) {
      return new _$(
        P2(e, this.marker),
        O2(e, this.content),
        this.checked,
        this.leadingTrivia ? P2(e, this.leadingTrivia) : void 0
      );
    }
    _localEquals(e) {
      return this.checked === e.checked;
    }
  };
  var me2 = class _me extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "table");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get _rows() {
      return this.content.filter((e) => e instanceof he2);
    }
    get headerRow() {
      return this._rows[0];
    }
    get delimiterRow() {
      return this._rows[1];
    }
    get bodyRows() {
      return this._rows.slice(2);
    }
    mapChildren(e) {
      return new _me(O2(e, this.content));
    }
  };
  var he2 = class _he extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "tableRow");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get cells() {
      return this.content.filter((e) => e instanceof ue2);
    }
    mapChildren(e) {
      return new _he(O2(e, this.content));
    }
  };
  var ue2 = class _ue extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "tableCell");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    mapChildren(e) {
      return new _ue(O2(e, this.content));
    }
  };
  var Fe2 = class _Fe extends E {
    constructor(e) {
      super();
      __publicField(this, "kind", "document");
      this.content = e;
    }
    get children() {
      return this.content;
    }
    get blocks() {
      return this.content.filter(Ve2);
    }
    mapChildren(e) {
      return new _Fe(O2(e, this.content));
    }
  };
  function Ve2(n) {
    return n instanceof U2 || n instanceof z2 || n instanceof K2 || n instanceof se2 || n instanceof ne2 || n instanceof pe2 || n instanceof H || n instanceof me2;
  }
  function pn(n) {
    const e = parse({ extensions: [math(), gfmTable(), gfmTaskListItem(), gfmStrikethrough()] }), t = preprocess()(n, void 0, true);
    return postprocess(e.document().write(t)).map(([i, r]) => ({
      type: i,
      tokenType: r.type,
      startOffset: r.start.offset,
      endOffset: r.end.offset
    }));
  }
  function mn(n) {
    return new wn(pn(n), n).build();
  }
  function Ue2(n) {
    const e = [];
    for (let t = 0; t < n.length; t++) {
      const s = n[t], i = n[t + 1];
      if (s instanceof N2 && s.glueKind === "indent") {
        if (i instanceof H) {
          const o2 = i.content.findIndex((c2) => c2 instanceof $);
          if (o2 >= 0) {
            const c2 = i.content.map((l2, a) => a === o2 ? Ye(l2, s) : l2);
            e.push(new H(i.ordered, c2)), t++;
            continue;
          }
        } else if (i instanceof $) {
          e.push(Ye(i, s)), t++;
          continue;
        }
        const r = e[e.length - 1];
        if (r instanceof N2 && r.glueKind === void 0) {
          e[e.length - 1] = new N2(r.content + s.content);
          continue;
        }
        e.push(new N2(s.content));
        continue;
      }
      e.push(s);
    }
    return e;
  }
  function Ye(n, e) {
    return new $(n.marker, n.content, n.checked, e);
  }
  function ke2(n) {
    const e = [];
    for (let t = 0; t < n.length; t++) {
      const s = n[t];
      if (s instanceof N2 && s.glueKind === void 0) {
        const i = e[e.length - 1], r = n[t + 1], o2 = i instanceof z2 && r instanceof z2, c2 = new N2(s.content, o2 ? "blockBreak" : "blockGap"), l2 = i !== void 0 ? Dt(i, c2) : void 0;
        l2 ? e[e.length - 1] = l2 : e.push(c2);
        continue;
      }
      e.push(s);
    }
    return e;
  }
  function Dt(n, e) {
    switch (n.kind) {
      case "paragraph":
        return new z2([...n.content, e]);
      case "heading": {
        const t = n;
        return new U2(t.level, t.marker, [...t.content, e]);
      }
      case "codeBlock": {
        const t = n;
        return new K2(t.language, [...t.content, e]);
      }
      case "mathBlock":
        return new se2([...n.content, e]);
      case "thematicBreak":
        return new ne2([...n.content, e]);
      case "table":
        return new me2([...n.content, e]);
      case "blockQuote":
        return new pe2(Me(n.content, e));
      case "list": {
        const t = n;
        return new H(t.ordered, Me(t.content, e));
      }
      case "listItem": {
        const t = n;
        return new $(t.marker, Me(t.content, e), t.checked, t.leadingTrivia);
      }
      default:
        return;
    }
  }
  function Me(n, e) {
    const t = n[n.length - 1], s = t !== void 0 ? Dt(t, e) : void 0;
    if (s) {
      const i = n.slice();
      return i[i.length - 1] = s, i;
    }
    return [...n, e];
  }
  function _n(n) {
    return n.some((e) => !(e instanceof N2)) ? n : [new z2(n)];
  }
  var C2 = class {
    constructor(e, t) {
      __publicField(this, "_entries", []);
      this._parentStart = e, this._source = t;
    }
    add(e, t) {
      this._entries.push({ node: e, start: t });
    }
    build(e, t) {
      this._entries.sort((c2, l2) => c2.start - l2.start);
      const s = [];
      let i = this._parentStart;
      const r = this._parentStart + e, o2 = (c2, l2) => {
        const a = this._source.substring(c2, l2), h = t ? null : /\n[^\S\n]+$/.exec(a);
        if (!h) {
          s.push(new N2(a, t));
          return;
        }
        const g2 = a.slice(h.index + 1);
        s.push(new N2(a.slice(0, a.length - g2.length))), s.push(new N2(g2, "indent"));
      };
      for (const { node: c2, start: l2 } of this._entries)
        c2.length !== 0 && (l2 > i && o2(i, l2), s.push(c2), i = l2 + c2.length);
      return i < r && o2(i, r), s;
    }
  };
  var wn = class {
    constructor(e, t) {
      __publicField(this, "_idx", 0);
      __publicField(this, "_checkChecked");
      this._events = e, this._source = t;
    }
    build() {
      const e = new C2(0, this._source);
      for (; this._idx < this._events.length; ) {
        const t = this._events[this._idx];
        if (t.type === "enter") {
          const s = t.startOffset, i = this._tryParseBlock();
          i ? e.add(i, s) : this._idx++;
        } else
          this._idx++;
      }
      return new Fe2(_n(ke2(e.build(this._source.length))));
    }
    _tryParseBlock() {
      switch (this._events[this._idx].tokenType) {
        case "atxHeading":
          return this._parseHeading();
        case "paragraph":
          return this._parseParagraph();
        case "codeFenced":
          return this._parseCodeFenced();
        case "mathFlow":
          return this._parseMathFlow();
        case "thematicBreak":
          return this._parseThematicBreak();
        case "blockQuote":
          return this._parseBlockQuote();
        case "listUnordered":
        case "listOrdered":
          return this._parseList();
        case "table":
          return this._parseTable();
        default:
          return;
      }
    }
    _parseHeading() {
      const e = this._consume("enter", "atxHeading");
      let t = 1, s = e.startOffset, i = e.startOffset;
      const r = [];
      for (; this._notExit("atxHeading"); ) {
        const h = this._events[this._idx];
        if (h.type === "enter" && h.tokenType === "atxHeadingSequence") {
          const g2 = this._consume("enter", "atxHeadingSequence"), u2 = this._consume("exit", "atxHeadingSequence");
          i === e.startOffset && (t = Math.min(6, Math.max(1, u2.endOffset - g2.startOffset)), s = g2.startOffset, i = u2.endOffset);
        } else h.type === "enter" && h.tokenType === "atxHeadingText" ? (this._consume("enter", "atxHeadingText"), this._parseInlines(r, "atxHeadingText"), this._consume("exit", "atxHeadingText")) : this._idx++;
      }
      const o2 = this._consume("exit", "atxHeading");
      i > s && r.length > 0 && (i = r[0].start);
      const c2 = new k2("headingMarker", this._source.substring(e.startOffset, i)), l2 = new C2(i, this._source);
      for (const h of r)
        l2.add(h.node, h.start);
      const a = l2.build(o2.endOffset - i);
      return new U2(t, c2, a);
    }
    _parseParagraph() {
      const e = this._consume("enter", "paragraph"), t = [];
      for (; this._notExit("paragraph"); )
        this._parseInlineEvent(t);
      const s = this._consume("exit", "paragraph"), i = new C2(e.startOffset, this._source);
      for (const r of t)
        i.add(r.node, r.start);
      return new z2(i.build(s.endOffset - e.startOffset));
    }
    _parseCodeFenced() {
      const e = this._consume("enter", "codeFenced");
      let t = "";
      const s = new C2(e.startOffset, this._source);
      let i = false, r, o2;
      for (; this._notExit("codeFenced"); ) {
        const l2 = this._events[this._idx];
        if (l2.type === "enter" && l2.tokenType === "codeFencedFence") {
          const a = this._consume("enter", "codeFencedFence");
          for (; this._notExit("codeFencedFence"); ) {
            const g2 = this._events[this._idx];
            if (g2.type === "enter" && g2.tokenType === "codeFencedFenceInfo") {
              for (this._consume("enter", "codeFencedFenceInfo"); this._notExit("codeFencedFenceInfo"); ) {
                const u2 = this._events[this._idx];
                u2.tokenType === "data" && (t = this._source.substring(u2.startOffset, u2.endOffset)), this._idx++;
              }
              this._consume("exit", "codeFencedFenceInfo");
            } else
              this._idx++;
          }
          const h = this._consume("exit", "codeFencedFence");
          s.add(new k2(
            i ? "closeFence" : "openFence",
            this._source.substring(a.startOffset, h.endOffset)
          ), a.startOffset), i = true;
        } else l2.tokenType === "codeFlowValue" || l2.tokenType === "lineEnding" ? (r === void 0 && (r = l2.startOffset), o2 = l2.endOffset, this._idx++) : this._idx++;
      }
      const c2 = this._consume("exit", "codeFenced");
      return r !== void 0 && s.add(new k2("content", this._source.substring(r, o2)), r), new K2(t, s.build(c2.endOffset - e.startOffset));
    }
    _parseMathFlow() {
      const e = this._consume("enter", "mathFlow"), t = new C2(e.startOffset, this._source);
      let s = false, i, r;
      for (; this._notExit("mathFlow"); ) {
        const c2 = this._events[this._idx];
        if (c2.type === "enter" && c2.tokenType === "mathFlowFence") {
          const l2 = this._consume("enter", "mathFlowFence");
          for (; this._notExit("mathFlowFence"); )
            this._idx++;
          const a = this._consume("exit", "mathFlowFence");
          t.add(new k2(
            s ? "closeFence" : "openFence",
            this._source.substring(l2.startOffset, a.endOffset)
          ), l2.startOffset), s = true;
        } else c2.tokenType === "mathFlowValue" || c2.tokenType === "lineEnding" ? (i === void 0 && (i = c2.startOffset), r = c2.endOffset, this._idx++) : this._idx++;
      }
      const o2 = this._consume("exit", "mathFlow");
      return i !== void 0 && t.add(new k2("content", this._source.substring(i, r)), i), new se2(t.build(o2.endOffset - e.startOffset));
    }
    _parseThematicBreak() {
      const e = this._consume("enter", "thematicBreak");
      for (; this._notExit("thematicBreak"); )
        this._idx++;
      const t = this._consume("exit", "thematicBreak"), s = new k2("content", this._source.substring(e.startOffset, t.endOffset));
      return new ne2([s]);
    }
    _parseBlockQuote() {
      const e = this._consume("enter", "blockQuote"), t = new C2(e.startOffset, this._source);
      let s = false;
      for (; this._notExit("blockQuote"); ) {
        const r = this._events[this._idx];
        if (r.type === "enter" && r.tokenType === "blockQuotePrefix") {
          const o2 = this._consume("enter", "blockQuotePrefix");
          for (; this._notExit("blockQuotePrefix"); )
            this._idx++;
          const c2 = this._consume("exit", "blockQuotePrefix");
          s || t.add(new k2("blockQuoteMarker", this._source.substring(o2.startOffset, c2.endOffset)), o2.startOffset);
        } else if (r.type === "enter") {
          const o2 = r.startOffset, c2 = this._tryParseBlock();
          c2 ? (t.add(c2, o2), s = true) : this._idx++;
        } else
          this._idx++;
      }
      const i = this._consume("exit", "blockQuote");
      return new pe2(ke2(t.build(i.endOffset - e.startOffset)));
    }
    _parseList() {
      const e = this._events[this._idx].tokenType, t = e === "listOrdered", s = this._consume("enter", e), i = new C2(s.startOffset, this._source);
      let r, o2, c2, l2, a, h;
      const g2 = () => {
        if (r === void 0 || o2 === void 0 || l2 === void 0)
          return;
        const d = new k2("listItemMarker", this._source.substring(o2, c2)), f2 = h ?? c2, p2 = l2.build(f2 - c2);
        i.add(new $(d, ke2(Ue2(p2)), a), r);
      };
      for (; this._notExit(e); ) {
        const d = this._events[this._idx];
        if (d.type === "enter" && d.tokenType === "listItemPrefix") {
          for (g2(), this._consume("enter", "listItemPrefix"), r = d.startOffset, o2 = d.startOffset, a = void 0, h = void 0, this._checkChecked = void 0; this._notExit("listItemPrefix"); )
            this._idx++;
          c2 = this._events[this._idx].endOffset, this._consume("exit", "listItemPrefix"), l2 = new C2(c2, this._source);
        } else if (d.type === "enter") {
          const f2 = d.startOffset, p2 = this._tryParseBlock();
          p2 && l2 ? (l2.add(p2, f2), h = f2 + p2.length, a === void 0 && this._checkChecked !== void 0 && (a = this._checkChecked)) : p2 || this._idx++;
        } else
          this._idx++;
      }
      g2();
      const u2 = this._consume("exit", e);
      return new H(t, ke2(Ue2(i.build(u2.endOffset - s.startOffset))));
    }
    _parseTable() {
      const e = this._consume("enter", "table"), t = new C2(e.startOffset, this._source);
      let s = 0;
      for (; this._notExit("table"); ) {
        const r = this._events[this._idx];
        if (r.type === "enter" && r.tokenType === "tableHead") {
          for (this._consume("enter", "tableHead"); this._notExit("tableHead"); ) {
            const o2 = this._events[this._idx];
            if (o2.type === "enter" && o2.tokenType === "tableRow") {
              const c2 = this._parseTableRow("tableHeader");
              s = c2.cells.length, t.add(c2, o2.startOffset);
            } else if (o2.type === "enter" && o2.tokenType === "tableDelimiterRow") {
              const c2 = o2.startOffset;
              for (; this._notExit("tableDelimiterRow"); )
                this._idx++;
              const l2 = this._events[this._idx].endOffset;
              this._idx++, t.add(this._buildDelimiterRow(c2, l2, s), c2);
            } else
              this._idx++;
          }
          this._consume("exit", "tableHead");
        } else if (r.type === "enter" && r.tokenType === "tableBody") {
          for (this._consume("enter", "tableBody"); this._notExit("tableBody"); ) {
            const o2 = this._events[this._idx];
            o2.type === "enter" && o2.tokenType === "tableRow" ? t.add(this._parseTableRow("tableData"), o2.startOffset) : this._idx++;
          }
          this._consume("exit", "tableBody");
        } else
          this._idx++;
      }
      const i = this._consume("exit", "table");
      return new me2(t.build(i.endOffset - e.startOffset));
    }
    _buildDelimiterRow(e, t, s) {
      const i = this._source.substring(e, t), r = [];
      for (let a = 0; a < i.length; a++)
        i[a] === "|" && r.push(a);
      const o2 = [], c2 = Math.max(1, s);
      if (i[0] === "|")
        for (let a = 0; a < c2 && a < r.length; a++)
          o2.push(r[a]);
      else {
        o2.push(0);
        for (let a = 0; a < c2 - 1 && a < r.length; a++)
          o2.push(r[a]);
      }
      const l2 = new C2(e, this._source);
      for (let a = 0; a < o2.length; a++) {
        const h = o2[a], g2 = a + 1 < o2.length ? o2[a + 1] : i.length, u2 = new C2(e + h, this._source), d = i.substring(h, g2);
        a === o2.length - 1 && d.length > 1 && d.endsWith("|") ? (u2.add(new k2("tableDelimiter", d.slice(0, -1)), e + h), u2.add(new k2("tableDelimiterClose", "|"), e + h + d.length - 1)) : u2.add(new k2("tableDelimiter", d), e + h), l2.add(new ue2(u2.build(g2 - h)), e + h);
      }
      return new he2(l2.build(t - e));
    }
    _parseTableRow(e) {
      const t = this._consume("enter", "tableRow"), s = new C2(t.startOffset, this._source);
      for (; this._notExit("tableRow"); ) {
        const r = this._events[this._idx];
        if (r.type === "enter" && r.tokenType === e) {
          const o2 = this._consume("enter", e), c2 = [];
          for (; this._notExit(e); ) {
            const h = this._events[this._idx];
            if (h.type === "enter" && h.tokenType === "tableContent") {
              for (this._consume("enter", "tableContent"); this._notExit("tableContent"); )
                this._parseInlineEvent(c2);
              this._consume("exit", "tableContent");
            } else
              this._idx++;
          }
          const l2 = this._consume("exit", e), a = new C2(o2.startOffset, this._source);
          for (const h of c2)
            a.add(h.node, h.start);
          s.add(new ue2(a.build(l2.endOffset - o2.startOffset, "tableCellGlue")), o2.startOffset);
        } else
          this._idx++;
      }
      const i = this._consume("exit", "tableRow");
      return new he2(s.build(i.endOffset - t.startOffset));
    }
    _parseInlines(e, t) {
      for (; this._idx < this._events.length; ) {
        const s = this._events[this._idx];
        if (s.type === "exit" && s.tokenType === t)
          return;
        this._parseInlineEvent(e);
      }
    }
    _parseInlineEvent(e) {
      const t = this._events[this._idx];
      if (t.type === "enter")
        switch (t.tokenType) {
          case "strongSequence":
          case "emphasisSequence":
            this._parseEmphasisOrStrong(e);
            return;
          case "codeText":
            e.push(this._parseInlineCode());
            return;
          case "mathText":
            e.push(this._parseInlineMath());
            return;
          case "link":
            e.push(this._parseLink());
            return;
          case "image":
            e.push(this._parseImage());
            return;
          case "strikethrough":
            e.push(this._parseStrikethrough());
            return;
          case "hardBreakTrailing":
          case "hardBreakEscape":
            e.push(this._parseHardBreak());
            return;
        }
      t.type === "exit" && (t.tokenType === "data" || t.tokenType === "codeTextData") && e.push({ node: new ve2(this._source.substring(t.startOffset, t.endOffset)), start: t.startOffset }), t.type === "exit" && t.tokenType === "taskListCheckValueChecked" ? this._checkChecked = true : t.type === "exit" && t.tokenType === "taskListCheckValueUnchecked" && (this._checkChecked = false), this._idx++;
    }
    /**
     * A GFM hard line break — either two-or-more trailing spaces
     * (`hardBreakTrailing`) or a backslash (`hardBreakEscape`) — followed by the
     * line ending it forces. Both halves are absorbed into a single
     * `hardBreak` marker, so the node *is* the whole break: a bare `lineEnding`
     * (a soft break) is never matched here and stays glue that collapses to a
     * space. Whether the line ending breaks is thus micromark's call, not ours.
     */
    _parseHardBreak() {
      const e = this._events[this._idx], t = e.tokenType;
      for (this._consume("enter", t); this._notExit(t); )
        this._idx++;
      let s = this._consume("exit", t).endOffset;
      const i = this._events[this._idx];
      return i && i.type === "enter" && i.tokenType === "lineEnding" && (this._consume("enter", "lineEnding"), s = this._consume("exit", "lineEnding").endOffset), { node: new k2("hardBreak", this._source.substring(e.startOffset, s)), start: e.startOffset };
    }
    _parseEmphasisOrStrong(e) {
      const t = this._events[this._idx].tokenType, s = t === "strongSequence", i = this._consume("enter", t), r = this._consume("exit", t), o2 = [];
      for (; this._idx < this._events.length; ) {
        const c2 = this._events[this._idx];
        if (c2.type === "enter" && c2.tokenType === t) {
          const l2 = this._consume("enter", t), a = this._consume("exit", t), h = new k2("openMarker", this._source.substring(i.startOffset, r.endOffset)), g2 = new k2("closeMarker", this._source.substring(l2.startOffset, a.endOffset)), u2 = new C2(r.endOffset, this._source);
          for (const p2 of o2)
            u2.add(p2.node, p2.start);
          const d = u2.build(l2.startOffset - r.endOffset), f2 = s ? new Be2(h, d, g2) : new Re(h, d, g2);
          e.push({ node: f2, start: i.startOffset });
          return;
        }
        this._parseInlineEvent(o2);
      }
      e.push({ node: new ve2(this._source.substring(i.startOffset, r.endOffset)), start: i.startOffset });
    }
    _parseInlineCode() {
      const e = this._consume("enter", "codeText"), t = new C2(e.startOffset, this._source);
      let s = false, i, r;
      for (; this._notExit("codeText"); ) {
        const c2 = this._events[this._idx];
        c2.type === "enter" && c2.tokenType === "codeTextSequence" ? (t.add(new k2(s ? "closeMarker" : "openMarker", this._source.substring(c2.startOffset, c2.endOffset)), c2.startOffset), s = true) : c2.type === "enter" && c2.tokenType === "codeTextData" && (i === void 0 && (i = c2.startOffset), r = c2.endOffset), this._idx++;
      }
      const o2 = this._consume("exit", "codeText");
      return i !== void 0 && t.add(new k2("content", this._source.substring(i, r)), i), { node: new Ae2(t.build(o2.endOffset - e.startOffset)), start: e.startOffset };
    }
    _parseInlineMath() {
      const e = this._consume("enter", "mathText"), t = new C2(e.startOffset, this._source);
      let s = false, i, r;
      for (; this._notExit("mathText"); ) {
        const c2 = this._events[this._idx];
        c2.type === "enter" && c2.tokenType === "mathTextSequence" ? (t.add(new k2(s ? "closeMarker" : "openMarker", this._source.substring(c2.startOffset, c2.endOffset)), c2.startOffset), s = true) : c2.type === "enter" && c2.tokenType === "mathTextData" && (i === void 0 && (i = c2.startOffset), r = c2.endOffset), this._idx++;
      }
      const o2 = this._consume("exit", "mathText");
      return i !== void 0 && t.add(new k2("content", this._source.substring(i, r)), i), { node: new $e2(t.build(o2.endOffset - e.startOffset)), start: e.startOffset };
    }
    _parseStrikethrough() {
      const e = this._consume("enter", "strikethrough");
      let t, s, i = e.startOffset, r = e.startOffset;
      const o2 = [];
      for (; this._notExit("strikethrough"); ) {
        const a = this._events[this._idx];
        if (a.type === "enter" && a.tokenType === "strikethroughSequence") {
          const h = this._source.substring(a.startOffset, a.endOffset);
          t ? (s = new k2("closeMarker", h), r = a.startOffset) : (t = new k2("openMarker", h), i = a.endOffset), this._idx++;
        } else a.type === "enter" && a.tokenType === "strikethroughText" ? (this._consume("enter", "strikethroughText"), this._parseInlines(o2, "strikethroughText"), this._consume("exit", "strikethroughText")) : this._idx++;
      }
      this._consume("exit", "strikethrough");
      const c2 = new C2(i, this._source);
      for (const a of o2)
        c2.add(a.node, a.start);
      const l2 = c2.build(r - i);
      return { node: new De2(t, l2, s), start: e.startOffset };
    }
    _parseLink() {
      const e = this._consume("enter", "link"), t = new C2(e.startOffset, this._source), s = [];
      let i = "", r = false;
      for (; this._notExit("link"); ) {
        const c2 = this._events[this._idx];
        if (c2.type === "enter" && c2.tokenType === "label") {
          for (this._consume("enter", "label"); this._notExit("label"); ) {
            const l2 = this._events[this._idx];
            if (l2.type === "enter" && l2.tokenType === "labelMarker")
              t.add(new k2(r ? "closeBracket" : "openBracket", this._source.substring(l2.startOffset, l2.endOffset)), l2.startOffset), r = true;
            else if (l2.type === "enter" && l2.tokenType === "labelText") {
              this._consume("enter", "labelText"), this._parseInlines(s, "labelText"), this._consume("exit", "labelText");
              continue;
            }
            this._idx++;
          }
          this._consume("exit", "label");
        } else if (c2.type === "enter" && c2.tokenType === "resource") {
          this._consume("enter", "resource");
          let l2 = false;
          for (; this._notExit("resource"); ) {
            const a = this._events[this._idx];
            a.type === "enter" && a.tokenType === "resourceMarker" ? (t.add(new k2(l2 ? "closeParen" : "openParen", this._source.substring(a.startOffset, a.endOffset)), a.startOffset), l2 = true) : a.type === "enter" && a.tokenType === "resourceDestinationString" && (i = this._source.substring(a.startOffset, a.endOffset), t.add(new k2("url", i), a.startOffset)), this._idx++;
          }
          this._consume("exit", "resource");
        } else
          this._idx++;
      }
      const o2 = this._consume("exit", "link");
      for (const c2 of s)
        t.add(c2.node, c2.start);
      return { node: new fe2(i, t.build(o2.endOffset - e.startOffset)), start: e.startOffset };
    }
    _parseImage() {
      const e = this._consume("enter", "image"), t = new C2(e.startOffset, this._source);
      let s = "", i = "", r = false;
      for (; this._notExit("image"); ) {
        const c2 = this._events[this._idx];
        if (c2.type === "enter" && c2.tokenType === "label") {
          for (this._consume("enter", "label"); this._notExit("label"); ) {
            const l2 = this._events[this._idx];
            l2.type === "enter" && l2.tokenType === "labelImageMarker" ? t.add(new k2("bangBracket", this._source.substring(l2.startOffset, l2.endOffset)), l2.startOffset) : l2.type === "enter" && l2.tokenType === "labelMarker" ? (t.add(new k2(r ? "closeBracket" : "openBracket", this._source.substring(l2.startOffset, l2.endOffset)), l2.startOffset), r = true) : l2.type === "enter" && l2.tokenType === "labelText" && (s = this._source.substring(l2.startOffset, l2.endOffset)), this._idx++;
          }
          this._consume("exit", "label");
        } else if (c2.type === "enter" && c2.tokenType === "resource") {
          this._consume("enter", "resource");
          let l2 = false;
          for (; this._notExit("resource"); ) {
            const a = this._events[this._idx];
            a.type === "enter" && a.tokenType === "resourceMarker" ? (t.add(new k2(l2 ? "closeParen" : "openParen", this._source.substring(a.startOffset, a.endOffset)), a.startOffset), l2 = true) : a.type === "enter" && a.tokenType === "resourceDestinationString" && (i = this._source.substring(a.startOffset, a.endOffset)), this._idx++;
          }
          this._consume("exit", "resource");
        } else
          this._idx++;
      }
      const o2 = this._consume("exit", "image");
      return { node: new ge2(s, i, t.build(o2.endOffset - e.startOffset)), start: e.startOffset };
    }
    _notExit(e) {
      if (this._idx >= this._events.length)
        return false;
      const t = this._events[this._idx];
      return !(t.type === "exit" && t.tokenType === e);
    }
    _consume(e, t) {
      const s = this._events[this._idx];
      if (!s || s.type !== e || s.tokenType !== t)
        throw new Error(`Expected ${e}:${t} at ${this._idx}, got ${s?.type}:${s?.tokenType}`);
      return this._idx++, s;
    }
  };
  var kn = class {
    constructor(e) {
      this._edit = e;
    }
    /**
     * The original range corresponding to `mod`, or `undefined` if `mod`
     * overlaps any replaced/inserted text (i.e. is not provably unchanged).
     */
    getOriginalRange(e) {
      let t = 0;
      for (const s of this._edit.replacements) {
        const i = s.replaceRange.start + t;
        if (i >= e.endExclusive)
          break;
        const r = i + s.newText.length;
        if (Math.max(i, e.start) < Math.min(r, e.endExclusive))
          return;
        t += s.newText.length - s.replaceRange.length;
      }
      return e.delta(-t);
    }
    /** The original offset for `mod`, or `undefined` if it falls inside inserted text. */
    getOriginalOffset(e) {
      let t = 0;
      for (const s of this._edit.replacements) {
        const i = s.replaceRange.start + t;
        if (e < i)
          break;
        if (e < i + s.newText.length)
          return;
        t += s.newText.length - s.replaceRange.length;
      }
      return e - t;
    }
  };
  var xn = class {
    constructor(e) {
      __publicField(this, "_byRange", /* @__PURE__ */ new Map());
      __publicField(this, "_byId", /* @__PURE__ */ new Map());
      this._walk(e, 0);
    }
    _walk(e, t) {
      const s = `${t}:${t + e.length}`;
      let i = this._byRange.get(s);
      i || (i = [], this._byRange.set(s, i)), i.push(e), this._byId.set(`${t}:${e.kind}`, e);
      let r = t;
      for (const o2 of e.children)
        this._walk(o2, r), r += o2.length;
    }
    /** The old node spanning exactly `range` with the given `kind`, if any. */
    lookupExact(e, t) {
      return this._byRange.get(`${e.start}:${e.endExclusive}`)?.find((s) => s.kind === t);
    }
    /** The old node that began at `originalStart` with the given `kind`. */
    lookupId(e, t) {
      return this._byId.get(`${e}:${t}`);
    }
  };
  function At(n, e, t, s, i) {
    let r, o2 = e;
    for (const g2 of n.children) {
      const u2 = At(g2, o2, t, s, i);
      u2 !== g2 && (r ?? (r = /* @__PURE__ */ new Map())).set(g2, u2), o2 += g2.length;
    }
    let c2 = r ? n.mapChildren(r) : n;
    const l2 = t.getOriginalRange(_2.ofStartAndLength(e, n.length));
    if (l2) {
      const g2 = s.lookupExact(l2, c2.kind);
      if (g2 && c2.structurallyEqual(g2))
        return g2;
    }
    const a = t.getOriginalOffset(e), h = a !== void 0 ? s.lookupId(a, c2.kind) : void 0;
    if (h && h.id !== c2.id && (c2 = c2.cloneWithId(h.id)), c2 instanceof K2 && h instanceof K2 && a !== void 0) {
      const g2 = vn(c2, h, a, i);
      if (g2)
        return g2;
    }
    return c2;
  }
  function vn(n, e, t, s) {
    const i = e.code, r = n.code;
    if (!i || !r || n.language !== e.language || n.openFence?.content !== e.openFence?.content || n.closeFence?.content !== e.closeFence?.content)
      return;
    const o2 = t + e.codeOffset, c2 = o2 + i.length;
    if (!bn(s, o2, c2))
      return;
    const l2 = yn(s, -o2);
    if (l2.apply(i.content) === r.content)
      return n.withCodeDiff(e, l2);
  }
  function bn(n, e, t) {
    for (const s of n.replacements)
      if (s.replaceRange.start < e || s.replaceRange.endExclusive > t)
        return false;
    return true;
  }
  function yn(n, e) {
    return new y2(n.replacements.map((t) => V2.replace(t.replaceRange.delta(e), t.newText)));
  }
  function En(n, e, t) {
    return At(n, 0, new kn(t), new xn(e), t);
  }
  function Cn(n, e, t) {
    const s = mn(n);
    return !e || !t ? s : En(s, e, t);
  }
  var On = class {
    parse(e, t, s) {
      return Cn(e.value, t, s);
    }
  };
  var Nn = Symbol("NO_ACTIVE_BLOCKS");
  var Ni = class {
    constructor() {
      __publicField(this, "_parser", new On());
      /**
       * The most recent edit applied to {@link sourceText}, used by
       * {@link document} to let the parser link incrementally edited code
       * blocks. Only trusted when it exactly bridges the previous and current
       * source text (see {@link document}).
       */
      __publicField(this, "_pendingEdit");
      __publicField(this, "sourceText", z(this, new Oe2("")));
      /**
       * The current selection, or `undefined` when the editor has no caret
       * (e.g. an inactive/unfocused rendering).
       */
      __publicField(this, "selection", z(this, x2.collapsed(0)));
      /**
       * Forces the rendered active-block set. `undefined` (the default)
       * derives the set from the current selection range (see
       * {@link activeBlocks}). The sentinel {@link NO_ACTIVE_BLOCKS} forces
       * "no active block" — useful in fixtures that always want the
       * collapsed/inactive rendering.
       */
      __publicField(this, "activeBlocksOverride", z(this, void 0));
      __publicField(this, "cursorOffset", Oe(
        this,
        (e) => e.readObservable(this.selection)?.active
      ));
      /**
       * The parsed document. Threads the previous document into the parser so
       * unchanged blocks keep their object identity across reparses (see
       * {@link MarkdownParser.parse}). Writing `previous` inside the compute is
       * a safe optimization: `derived` only recomputes when `sourceText`
       * changes, and the result is structurally identical to a full reparse.
       */
      __publicField(this, "document", (() => {
        let e, t;
        return Oe(this, (s) => {
          const i = s.readObservable(this.sourceText), r = this._pendingEdit, o2 = r && r.baseText === t && r.newText === i.value ? r.edit : void 0, c2 = this._parser.parse(i, e, o2);
          return e = c2, t = i.value, c2;
        });
      })());
      /**
       * Block that contains the cursor (selection's active end). Used by
       * cursor navigation to know which block's marker ranges count as
       * visible. Unaffected by {@link activeBlocksOverride} because
       * navigation is independent of rendering.
       */
      __publicField(this, "activeBlock", Oe(this, (e) => {
        const t = e.readObservable(this.document), s = e.readObservable(this.cursorOffset);
        if (s !== void 0)
          return Ft(t, s);
      }));
      /**
       * All blocks whose source range intersects the current selection.
       * The rendering side uses this to decide which blocks render in
       * their expanded (markers-visible) form. When the selection is
       * collapsed this is a one-element set holding {@link activeBlock}.
       */
      __publicField(this, "activeBlocks", Oe(this, (e) => {
        const t = e.readObservable(this.activeBlocksOverride);
        if (t === Nn)
          return /* @__PURE__ */ new Set();
        if (t !== void 0)
          return new Set(t);
        const s = e.readObservable(this.document), i = e.readObservable(this.selection);
        return i === void 0 ? /* @__PURE__ */ new Set() : new Set(In(s, i.range.start, i.range.endExclusive));
      }));
    }
    applyEdit(e) {
      const t = this.sourceText.get(), s = new Oe2(e.apply(t.value)), i = this.selection.get() ?? x2.collapsed(0), r = e.mapOffset(i.active);
      this._pendingEdit = { baseText: t.value, newText: s.value, edit: e }, this.sourceText.set(s, void 0), this.selection.set(x2.collapsed(r), void 0);
    }
    applyEditForSelection(e) {
      const t = this.sourceText.get(), s = new Oe2(e.apply(t.value)), i = this.selection.get() ?? x2.collapsed(0), r = e.mapOffset(i.range.endExclusive);
      this._pendingEdit = { baseText: t.value, newText: s.value, edit: e }, this.sourceText.set(s, void 0), this.selection.set(x2.collapsed(r), void 0);
    }
  };
  function Ft(n, e) {
    let t = 0, s;
    for (const i of n.children) {
      const r = t + i.length;
      if (n.blocks.includes(i)) {
        if (t <= e && e < r)
          return i;
        r === e && (s = i);
      }
      t = r;
    }
    return s;
  }
  function In(n, e, t) {
    if (e === t) {
      const r = Ft(n, e);
      return r ? [r] : [];
    }
    const s = [];
    let i = 0;
    for (const r of n.children) {
      const o2 = i + r.length;
      n.blocks.includes(r) && i < t && o2 > e && s.push(r), i = o2;
    }
    return s;
  }
  var __e = class __e {
    constructor(e) {
      this.lines = e;
    }
    static measure(e) {
      return An(e);
    }
    get lineCount() {
      return this.lines.length;
    }
    get isEmpty() {
      return this.lines.length === 0;
    }
    lineRect(e) {
      return this.lines[e].rect;
    }
    // ---- SourceOffset → ... -------------------------------------------
    /**
     * Line whose runs cover the offset, or the nearest line by source
     * distance if no run covers it.
     *
     * An offset that is only a run's *trailing* boundary (`offset ===
     * endExclusive`) — most notably the source offset just past a
     * line-breaking `\n`, which a zero-width run reports as its end on the line
     * it terminates — belongs to the START of the NEXT line instead. Preferring
     * the line that actually *starts* the offset makes the caret advance past a
     * newline to the next line rather than collapsing onto the previous line's
     * end (which would render two distinct offsets at the same caret position).
     * The first such trailing-boundary line is remembered as a fallback for the
     * document's very last offset, where no later line starts it.
     */
    lineIndexOfOffset(e) {
      let t = -1;
      for (let r = 0; r < this.lines.length; r++) {
        const o2 = this.lines[r].offsetMembership(e);
        if (o2 === "covers")
          return r;
        o2 === "end" && t < 0 && (t = r);
      }
      if (t >= 0)
        return t;
      let s = 0, i = 1 / 0;
      for (let r = 0; r < this.lines.length; r++) {
        const o2 = this.lines[r].sourceDistanceTo(e);
        o2 < i && (i = o2, s = r);
      }
      return s;
    }
    /**
     * x of the caret position before `offset`, on the line returned by
     * {@link lineIndexOfOffset}. Returns `0` when the map is empty.
     */
    xAtOffset(e) {
      return this.lines.length === 0 ? 0 : this.lines[this.lineIndexOfOffset(e)].xAtOffset(e);
    }
    // ---- Point2D → ... -------------------------------------------------
    /**
     * Line whose vertical band contains `y`, clamped to the first/last
     * line when `y` is outside the document.
     */
    lineIndexAtY(e) {
      if (this.lines.length === 0)
        return 0;
      for (let t = 0; t < this.lines.length; t++)
        if (e < this.lines[t].rect.bottom)
          return t;
      return this.lines.length - 1;
    }
    /**
     * Snap a 2D point to the nearest source offset. Uses `y` to pick a
     * line, then `x` to pick an offset within it. Up/down navigation
     * uses {@link offsetInLineAtX} directly to preserve desired column.
     */
    offsetAtPoint(e) {
      return this.offsetInLineAtX(this.lineIndexAtY(e.y), e.x);
    }
    /** Snap `x` to the nearest offset on a specific line. */
    offsetInLineAtX(e, t) {
      return e < 0 || e >= this.lines.length ? 0 : this.lines[e].offsetAtX(t);
    }
  };
  __publicField(__e, "EMPTY", new __e([]));
  var _e2 = __e;
  var Bn = class {
    constructor(e, t) {
      this.rect = e, this.runs = t;
    }
    containsOffset(e) {
      for (const t of this.runs)
        if (t.containsOffset(e))
          return true;
      return false;
    }
    /**
     * How `offset` relates to this line's runs:
     *   - `'covers'`: a run starts at or strictly contains the offset
     *     (`start <= offset < endExclusive`) — the caret belongs on this line.
     *   - `'end'`: the offset is only some run's trailing boundary
     *     (`offset === endExclusive`) with no run covering it — a line-break
     *     boundary the caret should leave for the next line.
     *   - `'none'`: no run touches the offset.
     */
    offsetMembership(e) {
      let t = false;
      for (const s of this.runs) {
        if (e >= s.sourceStart && e < s.sourceEndExclusive)
          return "covers";
        e === s.sourceEndExclusive && (t = true);
      }
      return t ? "end" : "none";
    }
    /**
     * Min `|offset - r|` over offsets `r` in any of this line's runs. Used
     * to pick the nearest line when no run actually covers the offset.
     */
    sourceDistanceTo(e) {
      let t = 1 / 0;
      for (const s of this.runs) {
        const i = s.sourceDistanceTo(e);
        i < t && (t = i);
      }
      return t;
    }
    /**
     * x of the caret position before `offset` on this line. When `offset`
     * is past all runs (trailing whitespace / blank line), returns the
     * right edge of the last run; when before all runs, returns the left
     * edge of the first run.
     */
    xAtOffset(e) {
      for (const s of this.runs)
        if (s.containsOffset(e))
          return s.xAtOffset(e);
      const t = this.runs[0];
      return e <= t.sourceStart ? t.rect.left : this.runs[this.runs.length - 1].rect.right;
    }
    /**
     * Snap `x` to the nearest offset on this line. If `x` falls inside a
     * run, the offset is interpolated by character fraction; otherwise it
     * snaps to the closer edge of the nearest run.
     */
    offsetAtX(e) {
      if (this.runs.length === 0)
        return 0;
      let t = this.runs[0], s = 1 / 0;
      for (const i of this.runs) {
        if (i.rect.containsX(e) || e === i.rect.right)
          return i.offsetAtX(e);
        const r = Math.min(Math.abs(e - i.rect.left), Math.abs(e - i.rect.right));
        r < s && (s = r, t = i);
      }
      return e <= t.rect.left ? t.sourceRange.start : t.sourceRange.endExclusive;
    }
  };
  var Le = class {
    constructor(e, t, s) {
      this.sourceRange = e, this.rect = t, this.source = s;
    }
    get sourceStart() {
      return this.sourceRange.start;
    }
    get sourceEndExclusive() {
      return this.sourceRange.endExclusive;
    }
    get sourceLength() {
      return this.sourceRange.length;
    }
    containsOffset(e) {
      return e >= this.sourceStart && e <= this.sourceEndExclusive;
    }
    sourceDistanceTo(e) {
      return e < this.sourceStart ? this.sourceStart - e : e > this.sourceEndExclusive ? e - this.sourceEndExclusive : 0;
    }
    xAtOffset(e) {
      if (this.sourceLength === 0)
        return this.rect.left;
      if (this.source)
        return Rn(this.source.textNode, this.source.textNodeStart + (e - this.sourceStart), this.rect.left);
      const t = (e - this.sourceStart) / this.sourceLength;
      return this.rect.left + t * this.rect.width;
    }
    offsetAtX(e) {
      if (this.rect.width <= 0)
        return this.sourceStart;
      if (this.source) {
        const s = Dn(this.source.textNode, this.source.textNodeStart, this.source.textNodeStart + this.sourceLength, e);
        return this.sourceStart + (s - this.source.textNodeStart);
      }
      const t = (e - this.rect.left) / this.rect.width;
      return this.sourceStart + Math.round(t * this.sourceLength);
    }
  };
  function Rn(n, e, t) {
    if (e <= 0)
      return t;
    const s = document.createRange();
    s.setStart(n, e - 1), s.setEnd(n, e);
    const i = s.getBoundingClientRect();
    return i.width === 0 && i.height === 0 ? t : i.right;
  }
  function Dn(n, e, t, s) {
    const i = document.createRange();
    let r = e, o2 = 1 / 0;
    for (let c2 = e; c2 < t; c2++) {
      i.setStart(n, c2), i.setEnd(n, c2 + 1);
      const l2 = i.getBoundingClientRect();
      if (l2.width === 0 && l2.height === 0)
        continue;
      const a = (l2.left + l2.right) / 2, h = Math.abs(s - l2.left), g2 = Math.abs(s - l2.right);
      if (h < o2 && (o2 = h, r = c2), g2 < o2 && (o2 = g2, r = c2 + 1), s >= l2.left && s <= l2.right)
        return s < a ? c2 : c2 + 1;
    }
    return r;
  }
  function An(n) {
    const e = [];
    for (const a of n) {
      const h = e.length;
      a.viewNode.forEachTextLeaf(a.absoluteStart, (g2, u2) => {
        const d = g2.dom;
        if (d.length === 0)
          return;
        const f2 = document.createRange();
        f2.selectNodeContents(d);
        const p2 = f2.getClientRects();
        if (p2.length === 0)
          return;
        const m2 = Fn(d);
        if (p2.length === 1)
          e.push(new Le(
            _2.fromTo(u2, u2 + d.length),
            et(p2[0], m2),
            { textNode: d, textNodeStart: 0 }
          ));
        else {
          const w = $n(d, p2);
          for (let v2 = 0; v2 < p2.length; v2++) {
            const I2 = v2 === 0 ? 0 : w[v2 - 1], X = v2 < w.length ? w[v2] : d.length;
            e.push(new Le(
              _2.fromTo(u2 + I2, u2 + X),
              et(p2[v2], m2),
              { textNode: d, textNodeStart: I2 }
            ));
          }
        }
      }), e.length === h && Vn(e, a.viewNode, a.absoluteStart);
    }
    e.sort((a, h) => a.rect.y - h.rect.y || a.rect.x - h.rect.x);
    const t = [];
    let s = [], i = -1 / 0, r = 0, o2 = 1 / 0, c2 = -1 / 0;
    const l2 = () => {
      s.length !== 0 && t.push(new Bn(
        R2.fromPointPoint(o2, i, c2, i + r),
        s
      ));
    };
    for (const a of e) {
      const h = a.rect, g2 = Math.min(i + r, h.y + h.height) - Math.max(i, h.y);
      s.length > 0 && g2 > Math.min(r, h.height) / 2 ? (s.push(a), r = Math.max(r, h.y + h.height - i), o2 = Math.min(o2, h.left), c2 = Math.max(c2, h.right)) : (l2(), s = [a], i = h.y, r = h.height, o2 = h.left, c2 = h.right);
    }
    return l2(), new _e2(t);
  }
  function $n(n, e) {
    const t = [], s = document.createRange();
    for (let i = 0; i < e.length - 1; i++) {
      const r = e[i + 1].y;
      let o2 = i === 0 ? 0 : t[i - 1], c2 = n.length;
      for (; o2 < c2; ) {
        const l2 = o2 + c2 >>> 1;
        s.setStart(n, l2), s.setEnd(n, Math.min(l2 + 1, n.length)), s.getBoundingClientRect().y < r - 1 ? o2 = l2 + 1 : c2 = l2;
      }
      t.push(o2);
    }
    return t;
  }
  function Fn(n) {
    const e = n.parentElement;
    if (!e)
      return 0;
    const t = getComputedStyle(e);
    let s = parseFloat(t.lineHeight);
    return isFinite(s) || (s = parseFloat(t.fontSize) * 1.2), s;
  }
  function et(n, e) {
    if (e <= n.height)
      return R2.fromPointSize(n.x, n.y, n.width, n.height);
    const t = (e - n.height) / 2;
    return R2.fromPointSize(n.x, n.y - t, n.width, e);
  }
  function Vn(n, e, t) {
    const s = e.dom;
    if (s.nodeType !== 1)
      return;
    const i = s.getBoundingClientRect();
    i.width === 0 && i.height === 0 || n.push(new Le(
      _2.fromTo(t, t + e.sourceLength),
      R2.fromPointSize(i.x, i.y, i.width, i.height)
    ));
  }
  var Pn = class {
    constructor() {
      __publicField(this, "measurements", z(this, []));
      /**
       * Concatenated visual line map across all mounted blocks. Lines are
       * left in DOM (client-coordinate) y order — each per-block map already
       * uses absolute client coordinates from `getClientRects()`, so the
       * concatenation is well-formed without re-sorting.
       */
      __publicField(this, "visualLineMap", Oe(this, (e) => {
        const s = e.readObservable(this.measurements).flatMap((i) => i.visualLineMap?.lines ?? []);
        return new _e2(s);
      }));
    }
  };
  function Vt(n, e, t, s) {
    let i = s === "right" ? t + 1 : t - 1, r = 0;
    for (const o2 of n.children) {
      if (n.blocks.includes(o2)) {
        const l2 = o2, a = Kn(l2, l2 === e, t - r);
        i = Hn(i, r, a, s);
      }
      r += o2.length;
    }
    return s === "right" ? Math.min(i, n.length) : Math.max(i, 0);
  }
  function Kn(n, e, t) {
    if (!e)
      return qn(n);
    if (n.kind === "list") {
      const s = Pt(n, t);
      return Wn(n, s);
    }
    return [];
  }
  function Hn(n, e, t, s) {
    if (s === "right")
      for (const i of t) {
        const r = n - e;
        (i.contains(r) || i.start === r) && (n = e + i.endExclusive);
      }
    else
      for (let i = t.length - 1; i >= 0; i--) {
        const r = t[i], o2 = n - e;
        (r.contains(o2) || r.endExclusive === o2) && (n = e + r.start);
      }
    return n;
  }
  function Pt(n, e) {
    let t = 0, s;
    for (let i = 0; i < n.children.length; i++) {
      const r = n.children[i], o2 = t + r.length, c2 = n.items.indexOf(r);
      if (c2 >= 0) {
        if (t <= e && e < o2)
          return c2;
        o2 === e && (s = c2);
      }
      t = o2;
    }
    return s;
  }
  function Wn(n, e) {
    const t = [];
    let s = 0;
    for (const i of n.children) {
      const r = n.items.indexOf(i);
      if (r >= 0 && r !== e) {
        const o2 = n.items[r];
        Pe(o2, s, t);
      }
      s += i.length;
    }
    return t.sort((i, r) => i.start - r.start), t;
  }
  function qn(n) {
    const e = [];
    return Pe(n, 0, e), e.sort((t, s) => t.start - s.start), e;
  }
  function Pe(n, e, t) {
    if (n.children.length === 0) {
      n instanceof k2 && t.push(_2.ofStartAndLength(e, n.length));
      return;
    }
    switch (n.kind) {
      case "codeBlock":
      case "mathBlock": {
        let i = e;
        for (const r of n.children)
          r instanceof k2 && (r.markerKind === "openFence" || r.markerKind === "closeFence") && t.push(_2.ofStartAndLength(i, r.length)), i += r.length;
        return;
      }
      case "inlineCode":
      case "inlineMath": {
        let i = e;
        for (const r of n.children)
          r instanceof k2 && (r.markerKind === "openMarker" || r.markerKind === "closeMarker") && t.push(_2.ofStartAndLength(i, r.length)), i += r.length;
        return;
      }
      case "thematicBreak":
        return;
      case "image": {
        t.push(_2.ofStartAndLength(e, n.length));
        return;
      }
    }
    let s = e;
    for (const i of n.children)
      Pe(i, s, t), s += i.length;
  }
  var jn = (n) => n.selection.isCollapsed ? Math.min(n.selection.active + 1, n.text.length) : n.selection.range.endExclusive;
  var Gn = (n) => n.selection.isCollapsed ? Math.max(n.selection.active - 1, 0) : n.selection.range.start;
  var zn = (n) => Math.min(n.selection.active + 1, n.text.length);
  var Xn = (n) => Math.max(n.selection.active - 1, 0);
  var Qn = (n) => Bt(n.text, n.selection.active);
  var tt = (n) => It(n.text, n.selection.active);
  var Un = (n) => n.text.lastIndexOf(`
`, n.selection.active - 1) + 1;
  var Yn = (n) => {
    const e = n.text.indexOf(`
`, n.selection.active);
    return e === -1 ? n.text.length : e;
  };
  var Jn = () => 0;
  var Zn = (n) => n.text.length;
  var nt = (n) => {
    const e = n.lineMap.lineIndexOfOffset(n.selection.active), t = n.desiredColumn ?? n.lineMap.xAtOffset(n.selection.active);
    return e >= n.lineMap.lineCount - 1 ? { offset: n.selection.active, desiredColumn: t } : { offset: n.lineMap.offsetInLineAtX(e + 1, t), desiredColumn: t };
  };
  var st = (n) => {
    const e = n.lineMap.lineIndexOfOffset(n.selection.active), t = n.desiredColumn ?? n.lineMap.xAtOffset(n.selection.active);
    return e <= 0 ? { offset: n.selection.active, desiredColumn: t } : { offset: n.lineMap.offsetInLineAtX(e - 1, t), desiredColumn: t };
  };
  var it = (n) => {
    const e = n.selection;
    if (!e.isCollapsed)
      return {
        edit: y2.delete(e.range),
        selection: x2.collapsed(e.range.start)
      };
    if (e.active === 0)
      return;
    const t = new _2(Vt(n.document, n.activeBlock, e.active, "left"), e.active);
    return {
      edit: y2.delete(t),
      selection: x2.collapsed(t.start)
    };
  };
  var es = (n) => {
    const e = n.selection;
    if (!e.isCollapsed)
      return {
        edit: y2.delete(e.range),
        selection: x2.collapsed(e.range.start)
      };
    if (e.active >= n.text.length)
      return;
    const t = new _2(e.active, Vt(n.document, n.activeBlock, e.active, "right"));
    return {
      edit: y2.delete(t),
      selection: x2.collapsed(t.start)
    };
  };
  var ts = (n) => {
    const e = n.selection;
    if (!e.isCollapsed)
      return {
        edit: y2.delete(e.range),
        selection: x2.collapsed(e.range.start)
      };
    if (e.active === 0)
      return;
    const t = It(n.text, e.active), s = new _2(t, e.active);
    return {
      edit: y2.delete(s),
      selection: x2.collapsed(t)
    };
  };
  var ns = (n) => {
    const e = n.selection;
    if (!e.isCollapsed)
      return {
        edit: y2.delete(e.range),
        selection: x2.collapsed(e.range.start)
      };
    if (e.active >= n.text.length)
      return;
    const t = Bt(n.text, e.active), s = new _2(e.active, t);
    return {
      edit: y2.delete(s),
      selection: x2.collapsed(e.active)
    };
  };
  function ss(n) {
    return (e) => {
      const t = y2.replace(e.selection.range, n), s = e.selection.range.start + n.length;
      return {
        edit: t,
        selection: x2.collapsed(s)
      };
    };
  }
  var is = (n) => {
    const e = y2.replace(n.selection.range, `

`), t = n.selection.range.start + 2;
    return {
      edit: e,
      selection: x2.collapsed(t)
    };
  };
  var rs = (n) => {
    const e = y2.replace(n.selection.range, `
`), t = n.selection.range.start + 1;
    return {
      edit: e,
      selection: x2.collapsed(t)
    };
  };
  var os = (n) => {
    const e = n.selection.range.start;
    let t = 0;
    for (; t < 2 && n.text[e - 1 - t] === " "; )
      t++;
    const i = " ".repeat(2 - t) + `
`, r = y2.replace(n.selection.range, i), o2 = e + i.length;
    return {
      edit: r,
      selection: x2.collapsed(o2)
    };
  };
  var cs = (n) => new x2(0, n.text.length);
  var ls = (n, e) => {
    const t = hn(n.text, e);
    return new x2(t.start, t.end);
  };
  function as(n, e) {
    return new x2(e.start, e.endExclusive);
  }
  var rt = /* @__PURE__ */ new WeakMap();
  var Te2 = /* @__PURE__ */ new WeakMap();
  var ie2 = class _ie extends qe {
    constructor(e, t, s = hs) {
      super();
      __publicField(this, "_children");
      this.ast = e, this.dom = t, this._children = s, rt.set(t, this);
      for (const i of s)
        Te2.set(i, this);
    }
    /** This node's view children (a mirror of `ast.children`). */
    get children() {
      return this._children;
    }
    /**
     * Replace this node's children in place, disposing the old ones and
     * re-pointing the new ones' parent to this node. The node value is still
     * conceptually immutable with respect to its `ast`/`dom` *identity*; this
     * is used only when a node patches its own DOM subtree in place (a code
     * block re-tokenising on a highlighter recolour), where the source-mapping
     * leaves must follow the new DOM text nodes without rebuilding the node
     * itself.
     */
    _replaceChildren(e) {
      for (const t of this._children)
        t.dispose();
      this._children = e;
      for (const t of e)
        Te2.set(t, this);
    }
    dispose() {
      for (const e of this._children)
        e.dispose();
    }
    /**
     * The number of source characters this node spans. Defaults to the length
     * of its {@link ast}; a synthetic leaf that subdivides one ast node (a
     * decorated-whitespace character, a code-block token span) shares that ast
     * for identity but overrides this with the length of its own slice, so the
     * renderer never has to fabricate an AST node just to carry a length.
     */
    get sourceLength() {
      return this.ast.length;
    }
    /**
     * The DOM node a parent mounts for this child. It is {@link dom} for almost
     * everything; a marker is the exception — its `dom` is the inner Text node
     * (so source ↔ DOM mapping lands on it) while the node it mounts is the
     * wrapping `<span>`.
     */
    get mountNode() {
      return this.dom;
    }
    /** The view node that rendered this node's parent, or `undefined` for a root. */
    get parent() {
      return Te2.get(this);
    }
    /**
     * Closest view node owning `domNode`: the node itself if registered, else
     * the nearest registered ancestor. Returns `undefined` if the DOM node is
     * outside any view tree.
     */
    static forDom(e) {
      for (let t = e; t; t = t.parentNode) {
        const s = rt.get(t);
        if (s)
          return s;
      }
    }
    /**
     * This node's start offset within its parent's local source space: the sum
     * of the `ast.length` of the siblings before it. Polymorphic via
     * {@link _localOffsetOfChild} so a parent whose children do not map
     * linearly (e.g. it hides or reorders some) can override how its children
     * are placed.
     */
    localOffsetInParent() {
      const e = this.parent;
      return e ? e._localOffsetOfChild(this) : 0;
    }
    /** Start offset of `child` within this node's local source space. */
    _localOffsetOfChild(e) {
      let t = 0;
      for (const s of this.children) {
        if (s === e)
          return t;
        t += s.sourceLength;
      }
      return t;
    }
    /**
     * Map a DOM hit that lands on THIS node's own representation into a source
     * range in this node's local space `[0, ast.length)`. Polymorphic: a text
     * leaf maps the caret offset 1:1; an element-only node (KaTeX math, `<hr>`,
     * an image, a hidden marker) has no internal text mapping and snaps to its
     * start by default — subclasses may override (e.g. to snap to the nearer
     * edge by x).
     */
    getLocalSourceRange(e) {
      return this.dom === e.node && this.dom.nodeType === 3 ? _2.emptyAt(Math.max(0, Math.min(e.offset, this.sourceLength))) : _2.emptyAt(0);
    }
    /**
     * DOM hit (any node + offset within it) → source offset relative to THIS
     * node, or `undefined` when the hit is outside this node's subtree. Enters
     * the tree at the closest owning view node ({@link forDom}), maps the hit
     * into that node's local space ({@link getLocalSourceRange}), then lifts the
     * range up the parent chain — adding each node's {@link localOffsetInParent} —
     * until it reaches this node.
     */
    resolveSource(e) {
      let t = _ie.forDom(e.node);
      if (!t)
        return;
      let s = t.getLocalSourceRange(e);
      for (; t !== this; ) {
        const i = t.parent;
        if (!i)
          return;
        s = s.delta(t.localOffsetInParent()), t = i;
      }
      return s.start;
    }
    /**
     * Source offset → DOM position. `nodeOffset` is the absolute source
     * offset of THIS node's start. Returns a position into a DOM Text node,
     * descending into children based on accumulated lengths.
     */
    sourceToDom(e, t = 0) {
      if (e < t || e > t + this.sourceLength)
        return;
      if (this.children.length === 0)
        return this.dom.nodeType === 3 ? { node: this.dom, offset: e - t } : void 0;
      let s = t;
      for (const i of this.children) {
        const r = s + i.sourceLength;
        if (e >= s && e <= r) {
          const o2 = i.sourceToDom(e, s);
          if (o2)
            return o2;
        }
        s = r;
      }
    }
    /** Visit every text-bearing leaf in this subtree with its absolute offset. */
    forEachTextLeaf(e, t) {
      if (this.children.length === 0) {
        this.dom.nodeType === 3 && t(this, e);
        return;
      }
      let s = e;
      for (const i of this.children)
        i.forEachTextLeaf(s, t), s += i.sourceLength;
    }
  };
  var hs = [];
  var M = class extends ie2 {
    constructor(e, t, s) {
      super(e.ast, t, s), this.data = e;
    }
    get block() {
      return this.data.ast;
    }
    get element() {
      return this.dom;
    }
    /**
     * Whether this already-built node can stand in for `data` unchanged. The
     * builder preserves view-data identity for any subtree whose ast and
     * selection-derived flags are unchanged (see `buildDocumentViewData`), so a
     * single identity check captures "nothing in my subtree changed" — and its
     * whole subtree, and any session it owns, are kept as-is.
     */
    canReuse(e) {
      return this.data === e;
    }
    /**
     * Called by the view after this block is mounted and measured, with the
     * block's rendered height in px. The default is a no-op; subclasses whose
     * active/inactive renderings have different intrinsic heights (e.g. a math
     * block) override this to remember a height to reserve across the toggle.
     */
    recordMeasuredHeight(e) {
    }
  };
  function re2(n, e, t) {
    if (t instanceof M) {
      if (t.canReuse(n))
        return t;
    } else if (t?.ast === n.ast)
      return t;
    switch (n.kind) {
      case "text":
        return gs(n, S2(t, He));
      case "marker":
        return n.ast.markerKind === "hardBreak" ? new lt(n, S2(t, lt)) : new ct(n, S2(t, ct));
      case "glue":
        return new be2(n, S2(t, be2));
      case "heading":
        return new at(n, e, S2(t, at));
      case "paragraph":
        return new F2(n, "p", "md-block md-paragraph", e, j2(t));
      case "codeBlock":
        return new We2(n, e, t);
      case "mathBlock":
        return new dt(n, e, S2(t, dt));
      case "thematicBreak":
        return new ht(n, e, S2(t, ht));
      case "blockQuote":
        return new F2(n, "blockquote", "md-block md-blockquote", e, j2(t));
      case "list":
        return new ft(n, e, S2(t, ft));
      case "listItem":
        return new gt(n, e, S2(t, gt));
      case "table":
        return new F2(n, "table", "md-block md-table", e, j2(t));
      case "tableRow":
        return new pt(n, e, S2(t, pt));
      case "tableCell":
        return new F2(n, "td", "", e, j2(t));
      case "strong":
        return new F2(n, "strong", "", e, j2(t));
      case "emphasis":
        return new F2(n, "em", "", e, j2(t));
      case "strikethrough":
        return new F2(n, "del", "", e, j2(t));
      case "inlineCode":
        return new mt(n, e, S2(t, mt));
      case "inlineMath":
        return new _t(n, e, S2(t, _t));
      case "link":
        return new wt(n, e, S2(t, wt));
      case "image":
        return new kt(n, e, S2(t, kt));
      case "document":
        return new F2(n, "div", "", e, j2(t));
    }
  }
  function S2(n, e) {
    return n instanceof e ? n : void 0;
  }
  function j2(n) {
    return n instanceof F2 ? n : void 0;
  }
  function W(n, e, t, s) {
    const { paired: i, unused: r } = qe2(e, t ?? T3), o2 = e.map((c2) => s(c2, i.get(c2)));
    for (const c2 of r)
      c2.dispose();
    return us(n, o2), o2;
  }
  function us(n, e) {
    ae2(n, e.map((t) => t.mountNode));
  }
  function ae2(n, e) {
    let t = n.firstChild, s = 0;
    for (; s < e.length && t === e[s]; s++)
      t = t.nextSibling;
    if (!(s === e.length && t === null)) {
      for (; s < e.length; s++) {
        const i = e[s];
        t === i ? t = i.nextSibling : n.insertBefore(i, t);
      }
      for (; t; ) {
        const i = t;
        t = t.nextSibling, n.removeChild(i);
      }
    }
  }
  function Y(n) {
    return (e, t) => re2(e, n, t);
  }
  function Kt(n) {
    return (e, t) => e.kind === "marker" && e.ast.markerKind === "content" ? new He(e, document.createTextNode(e.ast.content)) : re2(e, n, t);
  }
  var T3 = [];
  function ds(n) {
    return "content" in n ? n.content : fs;
  }
  var fs = [];
  function gs(n, e) {
    const t = n.ast.content, s = {
      leftBoundary: n.leftWordBoundary,
      rightBoundary: n.rightWordBoundary,
      decorateNewline: true
    };
    if (n.showWhitespace && Wt(t, s)) {
      const o2 = document.createElement("span");
      o2.className = "md-text";
      const c2 = Ke(o2, t, s, n.ast);
      return new M(n, o2, c2);
    }
    const i = e?.dom, r = i instanceof globalThis.Text && i.data === t ? i : document.createTextNode(t);
    return new He(n, r);
  }
  function ot(n) {
    return n === " " || n === "	" || n === `
` || n === "\r";
  }
  var ps = { leftBoundary: false, rightBoundary: false, decorateNewline: false };
  function ms(n, e, t) {
    const s = e > 0 ? !ot(n[e - 1]) : t.leftBoundary, i = e < n.length - 1 ? !ot(n[e + 1]) : t.rightBoundary;
    return s && i;
  }
  function Ht(n, e, t) {
    const s = n[e];
    if (s === "	")
      return "md-ws-tab";
    if (s === `
` || s === "\r")
      return t.decorateNewline ? "md-ws-newline" : void 0;
    if (s === " " && !ms(n, e, t))
      return "md-ws-space";
  }
  function Wt(n, e) {
    for (let t = 0; t < n.length; t++)
      if (Ht(n, t, e) !== void 0)
        return true;
    return false;
  }
  function _s(n, e) {
    const t = [];
    let s = -1;
    const i = (c2) => {
      s >= 0 && (t.push({ text: n.slice(s, c2), cls: void 0 }), s = -1);
    }, r = e.breakGlyphClass ? n.indexOf(`
`) : -1, o2 = e.newlineGlyph ? n.lastIndexOf(`
`) : -1;
    for (let c2 = 0; c2 < n.length; c2++) {
      const l2 = n[c2];
      if (e.newlineGlyph && (l2 === `
` || l2 === "\r")) {
        const h = c2 === r;
        if (c2 !== o2 || h) {
          i(c2), t.push({ text: l2, cls: h ? e.breakGlyphClass : "md-ws-newline-glyph", display: "\u21B5" });
          continue;
        }
      }
      const a = e.newlineGlyph && (l2 === `
` || l2 === "\r") ? void 0 : Ht(n, c2, e);
      if (a === void 0) {
        s < 0 && (s = c2);
        continue;
      }
      i(c2), t.push({ text: l2, cls: a });
    }
    return i(n.length), t;
  }
  function Ke(n, e, t, s) {
    const i = [];
    for (const r of _s(e, t)) {
      const o2 = document.createTextNode(r.display ?? r.text);
      if (r.cls) {
        const c2 = document.createElement("span");
        c2.className = r.cls, c2.appendChild(o2), n.appendChild(c2);
      } else
        n.appendChild(o2);
      i.push(new Q2(s, o2, T3, r.text.length));
    }
    return i;
  }
  var He = class extends M {
    constructor(e, t) {
      super(e, t, T3);
    }
  };
  var Q2 = class extends ie2 {
    constructor(e, t, s = T3, i = e.length) {
      super(e, t, s);
      __publicField(this, "_sourceLength");
      this._sourceLength = i;
    }
    get sourceLength() {
      return this._sourceLength;
    }
  };
  var ct = class extends M {
    constructor(e, t) {
      const s = e.ast, i = `md-marker md-marker-${s.markerKind}`, r = t && t.dom instanceof globalThis.Text && t.dom.data === s.content, o2 = r ? t._span : document.createElement("span");
      o2.className = e.visible ? i : `${i} md-marker-hidden`;
      const c2 = r ? t.dom : document.createTextNode(s.content);
      r || o2.appendChild(c2);
      super(e, c2, T3);
      __publicField(this, "_span");
      this._span = o2;
    }
    get mountNode() {
      return this._span;
    }
  };
  var be2 = class _be extends M {
    constructor(e, t) {
      const s = _be._build(e, t);
      super(e, s.dom, s.children);
      __publicField(this, "_span");
      this._span = s.span;
    }
    get mountNode() {
      return this._span;
    }
    static _build(e, t) {
      const s = e.ast, i = s.glueKind ? `md-glue md-glue-${s.glueKind}` : "md-glue", r = s.glueKind === "blockBreak", o2 = {
        leftBoundary: false,
        rightBoundary: false,
        decorateNewline: e.decorateNewline,
        // A blank-line `↵` glyph only belongs where the gap is hosted at the end
        // of a block's last line (inline flow, `decorateNewline`). The hostless
        // document-level gap (trailing a leaf thematic break, or leading the
        // first block) sits between block-level siblings where the break is
        // already visible, so it draws no glyph and simply collapses — making
        // e.g. `---\n\n…` and `---\n…` render identically.
        newlineGlyph: (s.glueKind === "blockGap" || r) && e.decorateNewline,
        breakGlyphClass: r ? "md-ws-blockbreak-glyph" : void 0
      };
      if (e.visible && Wt(s.content, o2)) {
        const g2 = document.createElement("span");
        g2.className = i;
        const u2 = Ke(g2, s.content, o2, s);
        return { span: g2, dom: g2, children: u2 };
      }
      const l2 = t && t.dom instanceof globalThis.Text && t.dom.data === s.content && t.children.length === 0, a = l2 ? t._span : document.createElement("span");
      a.className = e.visible ? i : `${i} md-glue-hidden`;
      const h = l2 ? t.dom : document.createTextNode(s.content);
      return l2 || a.appendChild(h), { span: a, dom: h, children: T3 };
    }
  };
  var lt = class extends M {
    constructor(e, t) {
      const s = e.ast.content, i = document.createElement("span");
      i.className = "md-hardbreak";
      const r = document.createElement("span");
      r.className = e.visible ? "md-hardbreak-src" : "md-hardbreak-src md-hardbreak-src-hidden";
      const o2 = e.visible ? Ke(r, s, ps, e.ast) : ws(r, s, e.ast);
      i.appendChild(r), i.appendChild(document.createElement("br"));
      super(e, i, o2);
      __publicField(this, "_span");
      this._span = i;
    }
    get mountNode() {
      return this._span;
    }
  };
  function ws(n, e, t) {
    const s = document.createTextNode(e);
    return n.appendChild(s), [new Q2(t, s)];
  }
  var F2 = class extends M {
    constructor(e, t, s, i, r) {
      const o2 = r?.element ?? document.createElement(t);
      !r && s && (o2.className = s);
      const c2 = W(o2, ds(e), r?.children, Y(i));
      super(e, o2, c2);
    }
  };
  var at = class extends M {
    constructor(e, t, s) {
      const i = s && s.element.tagName === `H${e.ast.level}`, r = i ? s.element : document.createElement(`h${e.ast.level}`);
      i || (r.className = "md-block md-heading");
      const o2 = W(r, e.content, s?.children, Y(t));
      super(e, r, o2);
    }
  };
  var ht = class extends M {
    constructor(e, t, s) {
      if (e.showMarkup) {
        const r = s?.dom instanceof HTMLDivElement ? s : void 0, o2 = r?.element ?? document.createElement("div");
        r || (o2.className = "md-block md-thematic-break-source");
        const c2 = W(o2, e.content, r?.children, Y(t));
        super(e, o2, c2);
        return;
      }
      const i = document.createElement("hr");
      i.className = "md-block md-thematic-break", super(e, i, T3);
    }
  };
  var We2 = class _We extends M {
    constructor(e, t, s) {
      const i = e.ast, r = i.code?.content ?? "", o2 = !e.showMarkup && i.language && t?.renderCustomCodeBlock ? t.renderCustomCodeBlock(i.language, r) ?? void 0 : void 0, c2 = t?.syntaxHighlighter, l2 = s instanceof _We ? s : void 0;
      let a;
      if (!o2 && c2 && i.language) {
        if (l2?._session && i === l2.ast)
          a = l2._session, l2._session = void 0;
        else if (l2?._session) {
          const f2 = i.getDiff(l2.ast);
          f2 && (a = l2._session, l2._session = void 0, A((p2) => a.update(f2.stringEdit, p2)));
        }
        a || (a = c2.create(i.language, r));
      }
      l2?._session && (l2._session.dispose(), l2._session = void 0), l2?._snapshotSub?.dispose(), l2 && (l2._snapshotSub = void 0);
      const h = a ? a.snapshot.get().getTokens(_2.ofLength(r.length)).tokens : void 0;
      let g2, u2, d;
      if (o2)
        o2.classList.add("md-block", "md-code-block"), g2 = o2, u2 = T3;
      else {
        const f2 = document.createElement("pre");
        f2.className = "md-block md-code-block";
        const p2 = [];
        for (const m2 of e.content)
          if (m2.ast === i.code) {
            const w = document.createElement("code");
            i.language && (w.className = `language-${CSS.escape(i.language)}`);
            const v2 = ks(i.code, r, w, h);
            v2 instanceof qt && (d = v2), p2.push(v2), f2.appendChild(w);
          } else {
            const w = re2(m2, t, void 0);
            f2.appendChild(w.mountNode), p2.push(w);
          }
        g2 = f2, u2 = p2;
      }
      super(e, g2, u2);
      __publicField(this, "_session");
      /**
       * Subscription that re-tokenises the rendered `<code>` in place whenever the
       * session advances its {@link ISyntaxHighlighterDocument.snapshot} *without*
       * a source edit (an async grammar finishing, a live recolour). It is tied to
       * this node's lifetime, but like {@link _session} it must be disposed
       * manually: a node reused as `previous` for a rebuild is never `dispose`d
       * (see {@link reconcileDomChildren}), so the rebuilding constructor disposes
       * its predecessor's subscription explicitly.
       */
      __publicField(this, "_snapshotSub");
      this._session = a, a && d && (this._snapshotSub = We(a.snapshot, () => {
        const f2 = a.snapshot.get();
        d.refresh(r, f2.getTokens(_2.ofLength(r.length)).tokens);
      }));
    }
    dispose() {
      this._snapshotSub?.dispose(), this._snapshotSub = void 0, this._session?.dispose(), this._session = void 0, super.dispose();
    }
  };
  function ks(n, e, t, s) {
    if (!s) {
      const i = document.createTextNode(e);
      return t.appendChild(i), new Q2(n, i);
    }
    return new qt(n, t, e, s);
  }
  var qt = class extends ie2 {
    constructor(e, t, s, i) {
      super(e, t, ut(e, t, s, i));
    }
    /** Re-render the token spans for a new colouring, in place. */
    refresh(e, t) {
      const s = this.dom;
      s.replaceChildren(), this._replaceChildren(ut(this.ast, s, e, t));
    }
  };
  function ut(n, e, t, s) {
    const i = [];
    let r = 0;
    for (const o2 of s) {
      const c2 = t.slice(r, r + o2.length);
      r += o2.length;
      const l2 = document.createTextNode(c2);
      if (o2.className) {
        const a = document.createElement("span");
        for (const h of o2.className.split("."))
          h && a.classList.add(`tok-${h}`);
        a.appendChild(l2), e.appendChild(a);
      } else
        e.appendChild(l2);
      i.push(new Q2(n, l2, T3, c2.length));
    }
    return i;
  }
  function jt(n) {
    let e = 0;
    for (const t of n) {
      if (t.kind === "marker" && t.markerKind === "content")
        return e;
      e += t.length;
    }
    return e;
  }
  function Gt(n, e, t) {
    const s = e.filter((c2) => c2.length > 0 && c2.start >= 0 && c2.start + c2.length <= t).slice().sort((c2, l2) => c2.start - l2.start), i = [];
    let r = 0;
    const o2 = (c2) => {
      c2 > 0 && i.push(new Q2(n, document.createTextNode(""), T3, c2));
    };
    for (const c2 of s)
      c2.start < r || (o2(c2.start - r), i.push(new Q2(n, c2.dom, T3, c2.length)), r = c2.start + c2.length);
    return o2(t - r), i;
  }
  var dt = class extends M {
    constructor(e, t, s) {
      var __super = (...args) => {
        super(...args);
        /**
         * The rendered (inactive, KaTeX) height in px, measured after mount and
         * carried forward across rebuilds via `previous`. When the block becomes
         * active (source markers shown) this height is reserved as a `min-height`
         * so the editor does not collapse below the rendered size, keeping the
         * surrounding layout stable as the caret enters and leaves the block.
         */
        __publicField(this, "_renderedHeight");
        return this;
      };
      const i = e.ast, r = s?._renderedHeight;
      if (e.showMarkup) {
        const a = document.createElement("pre");
        a.className = "md-block md-math-block", r !== void 0 && (a.style.boxSizing = "border-box", a.style.minHeight = `${r}px`);
        const h = [];
        for (const g2 of e.content)
          if (g2.ast === i.code) {
            const u2 = document.createElement("code"), d = document.createTextNode(i.code.content);
            u2.appendChild(d), a.appendChild(u2), h.push(new Q2(i.code, d));
          } else {
            const u2 = re2(g2, t, void 0);
            a.appendChild(u2.mountNode), h.push(u2);
          }
        __super(e, a, h), this._renderedHeight = r;
        return;
      }
      const o2 = i.code?.content ?? "", c2 = t?.renderMath?.({
        latex: o2,
        displayMode: true,
        className: "md-block md-math-block",
        nodeLength: i.length,
        contentStart: jt(i.content)
      });
      if (c2) {
        __super(e, c2.dom, Gt(i, c2.segments, i.length)), this._renderedHeight = r;
        return;
      }
      const l2 = document.createElement("div");
      l2.className = "md-block md-math-block";
      try {
        katex.render(o2, l2, { displayMode: true, throwOnError: false });
      } catch {
        l2.textContent = o2;
      }
      __super(e, l2, T3), this._renderedHeight = r;
    }
    recordMeasuredHeight(e) {
      this.data.showMarkup || (this._renderedHeight = e);
    }
  };
  var ft = class extends M {
    constructor(e, t, s) {
      const i = e.ast.ordered ? "ol" : "ul", r = s && s.element.tagName === i.toUpperCase(), o2 = r ? s.element : document.createElement(i);
      r || (o2.className = "md-block md-list");
      const c2 = W(o2, e.content, s?.children, Y(t));
      super(e, o2, c2);
    }
  };
  var gt = class extends M {
    constructor(e, t, s) {
      const i = e.ast, r = document.createElement("li");
      e.isActive && r.classList.add("md-list-item-active"), i.checked !== void 0 && r.classList.add("md-task-list-item"), e.isActive || r.classList.add("md-markers-hidden"), r.style.setProperty("--md-list-level", String(e.level));
      const o2 = xs(r, e.content, s, t);
      if (!e.isActive && i.checked !== void 0) {
        const c2 = document.createElement("input");
        c2.type = "checkbox", c2.checked = i.checked, c2.className = "md-checkbox";
        const l2 = t?.onToggleCheckbox;
        if (l2) {
          const a = i.checked;
          c2.addEventListener("mousedown", (h) => {
            h.stopPropagation(), h.preventDefault(), l2(i, !a);
          });
        } else
          c2.disabled = true;
        r.insertBefore(c2, r.firstChild);
      }
      super(e, r, o2);
    }
  };
  function xs(n, e, t, s) {
    const { paired: i, unused: r } = qe2(e, t?.children ?? T3), o2 = e.map((h) => re2(h, s, i.get(h)));
    for (const h of r)
      h.dispose();
    if (!(e.length >= 2 && e[0].kind === "glue" && e[0].ast.glueKind === "indent" && e[1].kind === "marker" && e[1].ast.markerKind === "listItemMarker"))
      return ae2(n, o2.map((h) => h.mountNode)), o2;
    const l2 = n.firstElementChild, a = l2 && l2.classList.contains("md-list-gutter") ? l2 : document.createElement("span");
    return a.className = "md-list-gutter", ae2(a, [o2[0].mountNode, o2[1].mountNode]), ae2(n, [a, ...o2.slice(2).map((h) => h.mountNode)]), o2;
  }
  var pt = class extends M {
    constructor(e, t, s) {
      const i = s?.element ?? document.createElement("tr");
      e.isDelimiter && i.classList.add("md-table-delimiter-row");
      const r = W(i, e.content, s?.children, Y(t));
      e.isDelimiter || e.content.forEach((o2, c2) => {
        o2.kind === "tableCell" && o2.isActive && r[c2].element.classList.add("md-table-cell-active");
      }), super(e, i, r);
    }
  };
  var mt = class extends M {
    constructor(e, t, s) {
      const i = s?.element ?? document.createElement("code"), r = W(i, e.content, s?.children, Kt(t));
      super(e, i, r);
    }
  };
  var _t = class extends M {
    constructor(e, t, s) {
      if (e.showMarkup) {
        const l2 = document.createElement("span");
        l2.className = "md-inline-math";
        const a = W(l2, e.content, s?.children, Kt(t));
        super(e, l2, a);
        return;
      }
      const r = e.content.find(
        (l2) => l2.kind === "marker" && l2.ast.markerKind === "content"
      )?.ast.content ?? "", o2 = t?.renderMath?.({
        latex: r,
        displayMode: false,
        className: "md-inline-math",
        nodeLength: e.ast.length,
        contentStart: jt(e.ast.content)
      });
      if (o2) {
        super(e, o2.dom, Gt(e.ast, o2.segments, e.ast.length));
        return;
      }
      const c2 = document.createElement("span");
      c2.className = "md-inline-math";
      try {
        katex.render(r, c2, { throwOnError: false });
      } catch {
        c2.textContent = r;
      }
      super(e, c2, T3);
    }
  };
  var wt = class extends M {
    constructor(e, t, s) {
      const i = s?.element ?? document.createElement("a");
      zt(e.ast.url) ? (i.href = e.ast.url, i.dataset.mdUrl = e.ast.url) : (i.removeAttribute("href"), delete i.dataset.mdUrl), s || i.addEventListener("mousedown", (o2) => {
        const c2 = i.dataset.mdUrl;
        !c2 || i.closest(".md-block-active") !== null && !(o2.ctrlKey || o2.metaKey) || (o2.preventDefault(), o2.stopPropagation(), t?.onOpenLink ? t.onOpenLink(c2, o2) : window.open(c2, "_blank", "noopener"));
      });
      const r = W(i, e.content, s?.children, Y(t));
      super(e, i, r);
    }
  };
  var kt = class extends M {
    constructor(e, t, s) {
      const i = e.ast;
      if (e.showMarkup) {
        const o2 = document.createElement("span");
        o2.className = "md-image-source";
        const c2 = W(o2, e.content, s?.children, Y(t));
        super(e, o2, c2);
        return;
      }
      const r = document.createElement("img");
      zt(i.url) && (r.src = i.url), r.alt = i.alt, super(e, r, T3);
    }
  };
  function qe2(n, e) {
    const t = /* @__PURE__ */ new Map();
    for (const i of e)
      t.set(i.ast.id, i);
    const s = /* @__PURE__ */ new Map();
    for (const i of n) {
      const r = t.get(i.ast.id);
      r && (s.set(i, r), t.delete(i.ast.id));
    }
    return { paired: s, unused: [...t.values()] };
  }
  function zt(n) {
    return !n.trim().toLowerCase().startsWith("javascript:");
  }
  var je2 = class _je extends ie2 {
    constructor(e, t, s, i) {
      super(e, t, i), this.blocks = s;
    }
    static create(e, t, s) {
      const i = s?.contentDomNode ?? document.createElement("div"), r = new Map(
        e.children.filter((u2) => u2.kind === "block").map((u2) => [u2.view, u2.isActive])
      ), o2 = s?.children, c2 = e.children.map((u2) => u2.view), { paired: l2, unused: a } = qe2(c2, o2 ?? vs), h = c2.map((u2, d) => {
        const f2 = l2.get(u2), p2 = re2(u2, t, f2);
        if (e.children[d].kind === "block") {
          const m2 = r.get(u2);
          m2 !== void 0 && (p2.element.classList.toggle("md-block-active", m2), p2.element.classList.toggle("md-markers-hidden", !m2));
        }
        return p2;
      });
      for (const u2 of a)
        u2.dispose();
      ae2(i, h.map((u2) => u2.mountNode));
      const g2 = [];
      return e.children.forEach((u2, d) => {
        u2.kind === "block" && g2.push({ node: h[d], absoluteStart: u2.absoluteStart });
      }), new _je(e.ast, i, g2, h);
    }
    /** The stable content element this document mounts its children into. */
    get contentDomNode() {
      return this.dom;
    }
  };
  var vs = [];
  function bs(n) {
    const e = document;
    if (e.caretPositionFromPoint) {
      const s = e.caretPositionFromPoint(n.x, n.y);
      return s ? { node: s.offsetNode, offset: s.offset } : void 0;
    }
    const t = e.caretRangeFromPoint?.(n.x, n.y);
    if (t)
      return { node: t.startContainer, offset: t.startOffset };
  }
  var ys = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "document");
      this.ast = e, this.blocks = t, this.children = s;
    }
  };
  var Es = class {
    constructor(e, t) {
      __publicField(this, "kind", "heading");
      this.ast = e, this.content = t;
    }
  };
  var Cs = class {
    constructor(e, t) {
      __publicField(this, "kind", "paragraph");
      this.ast = e, this.content = t;
    }
  };
  var Os = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "codeBlock");
      this.ast = e, this.showMarkup = t, this.content = s;
    }
  };
  var Ms = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "mathBlock");
      this.ast = e, this.showMarkup = t, this.content = s;
    }
  };
  var Ts = class {
    constructor(e, t) {
      __publicField(this, "kind", "blockQuote");
      this.ast = e, this.content = t;
    }
  };
  var Ss = class {
    constructor(e, t) {
      __publicField(this, "kind", "list");
      this.ast = e, this.content = t;
    }
  };
  var Ls = class {
    constructor(e, t) {
      __publicField(this, "kind", "table");
      this.ast = e, this.content = t;
    }
  };
  var Ns = class {
    constructor(e, t) {
      __publicField(this, "kind", "strong");
      this.ast = e, this.content = t;
    }
  };
  var Is = class {
    constructor(e, t) {
      __publicField(this, "kind", "emphasis");
      this.ast = e, this.content = t;
    }
  };
  var Bs = class {
    constructor(e, t) {
      __publicField(this, "kind", "strikethrough");
      this.ast = e, this.content = t;
    }
  };
  var Rs = class {
    constructor(e, t) {
      __publicField(this, "kind", "inlineCode");
      this.ast = e, this.content = t;
    }
  };
  var Ds = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "inlineMath");
      this.ast = e, this.showMarkup = t, this.content = s;
    }
  };
  var As = class {
    constructor(e, t) {
      __publicField(this, "kind", "link");
      this.ast = e, this.content = t;
    }
  };
  var $s = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "image");
      this.ast = e, this.showMarkup = t, this.content = s;
    }
  };
  var Fs = class {
    constructor(e, t, s, i) {
      __publicField(this, "kind", "listItem");
      this.ast = e, this.isActive = t, this.content = s, this.level = i;
    }
  };
  var Vs = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "tableRow");
      this.ast = e, this.isDelimiter = t, this.content = s;
    }
  };
  var Ps = class {
    constructor(e, t, s, i) {
      __publicField(this, "kind", "tableCell");
      this.ast = e, this.isActive = t, this.showTableGlue = s, this.content = i;
    }
  };
  var Ks = class {
    /**
     * Whether non-obvious whitespace in this text is revealed (block is active).
     * `leftWordBoundary`/`rightWordBoundary` say whether the inline sibling on
     * that side ends/starts with visible word content (e.g. inline code, a link,
     * emphasis); a single space touching such a sibling is obvious and stays
     * undecorated, just like a space between two words within this leaf.
     */
    constructor(e, t, s = false, i = false) {
      __publicField(this, "kind", "text");
      this.ast = e, this.showWhitespace = t, this.leftWordBoundary = s, this.rightWordBoundary = i;
    }
  };
  var Hs = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "thematicBreak");
      this.ast = e, this.showMarkup = t, this.content = s;
    }
  };
  var Ws = class {
    constructor(e, t) {
      __publicField(this, "kind", "marker");
      this.ast = e, this.visible = t;
    }
  };
  var Xt = class {
    constructor(e, t, s) {
      __publicField(this, "kind", "glue");
      this.ast = e, this.visible = t, this.decorateNewline = s;
    }
  };
  var qs = { showMarkup: false, showTableGlue: false, selectionInNode: void 0 };
  function B2(n) {
    return n.inlineFlow ? n : { ...n, inlineFlow: true };
  }
  function Qt(n, e, t, s) {
    const i = /* @__PURE__ */ new Map();
    if (s)
      for (const u2 of s.children)
        i.set(u2.view.ast, u2);
    const r = n.content, o2 = new Set(n.blocks), c2 = (u2) => u2 >= 0 && u2 < r.length && o2.has(r[u2]), l2 = (u2) => c2(u2) && e.has(r[u2]), a = [], h = [];
    let g2 = 0;
    for (let u2 = 0; u2 < r.length; u2++) {
      const d = r[u2];
      if (o2.has(d)) {
        const f2 = d, p2 = e.has(f2), m2 = i.get(f2);
        let w;
        if (!p2)
          w = m2 && !m2.isActive ? m2.view : vt(f2, qs, m2?.view);
        else {
          const v2 = t ? new _2(
            Math.max(0, t.start - g2),
            Math.min(f2.length, t.endExclusive - g2)
          ) : void 0;
          w = vt(f2, { showMarkup: true, showTableGlue: false, selectionInNode: v2 }, m2?.view);
        }
        a.push({ ast: f2, absoluteStart: g2, isActive: p2, view: w }), h.push({ absoluteStart: g2, isActive: p2, view: w, kind: "block" });
      } else if (d instanceof N2 && (d.glueKind === "blockGap" || d.glueKind === "blockBreak")) {
        const f2 = xt(c2, l2, r.length, u2, -1), p2 = f2 || xt(c2, l2, r.length, u2, 1), m2 = i.get(d), w = b2(m2?.view, new Xt(d, p2, f2));
        h.push({ absoluteStart: g2, isActive: p2, view: w, kind: "glue" });
      }
      g2 += d.length;
    }
    return new ys(n, a, h);
  }
  function xt(n, e, t, s, i) {
    for (let r = s + i; r >= 0 && r < t; r += i)
      if (n(r))
        return e(r);
    return false;
  }
  function vt(n, e, t) {
    return oe2(n, e, t);
  }
  function oe2(n, e, t, s) {
    const i = n;
    switch (i.kind) {
      case "text":
        return b2(t, new Ks(i, e.showMarkup, s?.left ?? false, s?.right ?? false));
      // The trailing gap the parser absorbs into the break is inline flow, so its
      // revealed newlines get the `↵` glyph (each its own width) — without it the
      // raw `\n`s are zero-width and the caret can't tell them apart.
      case "thematicBreak":
        return b2(t, new Hs(i, e.showMarkup, L2(i.children, B2(e), t)));
      case "marker":
        return b2(t, new Ws(i, zs(i.markerKind, e)));
      case "glue":
        return b2(t, new Xt(i, Xs(i.glueKind, e), e.inlineFlow ?? false));
      case "heading":
        return b2(t, new Es(i, L2(i.children, B2(e), t)));
      case "paragraph":
        return b2(t, new Cs(i, L2(i.children, B2(e), t)));
      case "codeBlock":
        return b2(t, new Os(i, e.showMarkup, L2(i.children, e, t)));
      case "mathBlock":
        return b2(t, new Ms(i, e.showMarkup, L2(i.children, e, t)));
      case "blockQuote":
        return b2(t, new Ts(i, L2(i.children, e, t)));
      case "list":
        return b2(t, Qs(i, e, t));
      case "listItem":
        return b2(t, Ut(i, e, t));
      case "table":
        return b2(t, Us(i, e, t));
      case "tableRow":
        return b2(t, Yt(i, e, false, t));
      case "tableCell":
        return b2(t, Jt(i, e.showMarkup, e.showTableGlue, e.selectionInNode, t));
      case "strong":
        return b2(t, new Ns(i, L2(i.children, B2(e), t)));
      case "emphasis":
        return b2(t, new Is(i, L2(i.children, B2(e), t)));
      case "strikethrough":
        return b2(t, new Bs(i, L2(i.children, B2(e), t)));
      case "inlineCode":
        return b2(t, new Rs(i, L2(i.children, B2(e), t)));
      case "inlineMath":
        return b2(t, new Ds(i, e.showMarkup, L2(i.children, B2(e), t)));
      case "link":
        return b2(t, new As(i, L2(i.children, B2(e), t)));
      case "image":
        return b2(t, new $s(i, e.showMarkup, L2(i.children, B2(e), t)));
      case "document":
        return Qt(i, /* @__PURE__ */ new Set(), _2.ofLength(0), void 0);
    }
  }
  function Ne(n) {
    return n.kind === "document" ? n.blocks.map((e) => e.view) : "content" in n ? n.content : js;
  }
  var js = [];
  function we2(n) {
    if (!n)
      return;
    const e = /* @__PURE__ */ new Map();
    for (const t of Ne(n))
      e.set(t.ast, t);
    return e;
  }
  function b2(n, e) {
    if (n && n.kind === e.kind && n.ast === e.ast && Gs(n, e)) {
      const t = Ne(n), s = Ne(e);
      if (t.length === s.length && t.every((i, r) => i === s[r]))
        return n;
    }
    return e;
  }
  function Gs(n, e) {
    switch (n.kind) {
      case "text":
        return n.showWhitespace === e.showWhitespace && n.leftWordBoundary === e.leftWordBoundary && n.rightWordBoundary === e.rightWordBoundary;
      case "marker":
        return n.visible === e.visible;
      case "glue":
        return n.visible === e.visible && n.decorateNewline === e.decorateNewline;
      case "thematicBreak":
        return n.showMarkup === e.showMarkup;
      case "codeBlock":
        return n.showMarkup === e.showMarkup;
      case "mathBlock":
        return n.showMarkup === e.showMarkup;
      case "inlineMath":
        return n.showMarkup === e.showMarkup;
      case "image":
        return n.showMarkup === e.showMarkup;
      case "listItem":
        return n.isActive === e.isActive;
      case "tableCell": {
        const t = e;
        return n.isActive === t.isActive && n.showTableGlue === t.showTableGlue;
      }
      case "tableRow":
        return n.isDelimiter === e.isDelimiter;
      default:
        return true;
    }
  }
  function L2(n, e, t) {
    const s = we2(t);
    return n.map((i, r) => {
      const o2 = i.kind === "text" ? {
        left: r > 0 && bt(n[r - 1], "end"),
        right: r < n.length - 1 && bt(n[r + 1], "start")
      } : void 0;
      return oe2(i, e, s?.get(i), o2);
    });
  }
  function bt(n, e) {
    switch (n.kind) {
      case "text": {
        const t = n.content, s = e === "end" ? t[t.length - 1] : t[0];
        return s !== void 0 && s !== " " && s !== "	" && s !== `
` && s !== "\r";
      }
      case "inlineCode":
      case "inlineMath":
      case "link":
      case "image":
      case "strong":
      case "emphasis":
      case "strikethrough":
        return true;
      default:
        return false;
    }
  }
  function zs(n, e) {
    return e.showMarkup || n === "tableCellGlue" && e.showTableGlue;
  }
  function Xs(n, e) {
    return e.showMarkup || n === "tableCellGlue" && e.showTableGlue;
  }
  function Qs(n, e, t) {
    const s = we2(t), i = Ys(n, e), r = new Set(n.items), o2 = (e.listLevel ?? 0) + 1, c2 = [];
    let l2 = 0;
    for (const a of n.children) {
      if (r.has(a)) {
        const h = a, g2 = i.has(n.items.indexOf(h)), u2 = {
          showMarkup: g2,
          showTableGlue: false,
          selectionInNode: g2 && e.selectionInNode ? e.selectionInNode.delta(-l2) : void 0,
          listLevel: o2
        };
        c2.push(b2(s?.get(h), Ut(h, u2, s?.get(h))));
      } else
        c2.push(oe2(a, e, s?.get(a)));
      l2 += a.length;
    }
    return new Ss(n, c2);
  }
  function Ut(n, e, t) {
    const s = we2(t), i = [];
    let r = 0;
    for (const o2 of n.children) {
      const c2 = e.selectionInNode ? { ...e, selectionInNode: e.selectionInNode.delta(-r) } : e;
      i.push(oe2(o2, c2, s?.get(o2))), r += o2.length;
    }
    return new Fs(n, e.showMarkup, i, e.listLevel ?? 1);
  }
  function Us(n, e, t) {
    const s = we2(t), i = e.showMarkup, r = n.delimiterRow, o2 = new Set(
      [n.headerRow, n.delimiterRow, ...n.bodyRows].filter((a) => a !== void 0)
    ), c2 = [];
    let l2 = 0;
    for (const a of n.children) {
      if (o2.has(a)) {
        const h = a, g2 = h === r, u2 = {
          showMarkup: i,
          showTableGlue: i,
          selectionInNode: !g2 && i && e.selectionInNode ? e.selectionInNode.delta(-l2) : void 0
        };
        c2.push(b2(s?.get(h), Yt(h, u2, g2, s?.get(h))));
      } else
        c2.push(oe2(a, e, s?.get(a)));
      l2 += a.length;
    }
    return new Ls(n, c2);
  }
  function Yt(n, e, t, s) {
    const i = we2(s), r = e.showMarkup, o2 = t ? void 0 : Js(n, e), c2 = new Set(n.cells), l2 = [];
    let a = 0;
    for (const h of n.children) {
      if (c2.has(h)) {
        const g2 = h, u2 = t ? r : o2.has(n.cells.indexOf(g2)), d = u2 && e.selectionInNode ? e.selectionInNode.delta(-a) : void 0;
        l2.push(Jt(g2, u2, r, d, i?.get(g2)));
      } else
        l2.push(oe2(h, e, i?.get(h)));
      a += h.length;
    }
    return new Vs(n, t, l2);
  }
  function Jt(n, e, t, s, i) {
    const r = { showMarkup: e, showTableGlue: t, selectionInNode: s };
    return new Ps(n, e, t, L2(n.children, B2(r), i));
  }
  var ye = /* @__PURE__ */ new Set();
  function Ys(n, e) {
    if (!e.showMarkup || !e.selectionInNode)
      return ye;
    const t = e.selectionInNode;
    if (t.isEmpty) {
      const r = Pt(n, t.start);
      return r === void 0 ? ye : /* @__PURE__ */ new Set([r]);
    }
    const s = /* @__PURE__ */ new Set();
    let i = 0;
    for (const r of n.children) {
      const o2 = n.items.indexOf(r);
      o2 >= 0 && i < t.endExclusive && i + r.length > t.start && s.add(o2), i += r.length;
    }
    return s;
  }
  function Js(n, e) {
    if (!e.showMarkup || !e.selectionInNode)
      return ye;
    const t = e.selectionInNode;
    if (t.isEmpty) {
      const r = Zs(n, t.start);
      return r === void 0 ? ye : /* @__PURE__ */ new Set([r]);
    }
    const s = /* @__PURE__ */ new Set();
    let i = 0;
    for (const r of n.children) {
      const o2 = n.cells.indexOf(r);
      o2 >= 0 && i < t.endExclusive && i + r.length > t.start && s.add(o2), i += r.length;
    }
    return s;
  }
  function Zs(n, e) {
    let t = 0;
    for (const s of n.children) {
      const i = t + s.length, r = n.cells.indexOf(s);
      if (r >= 0 && (t <= e && e < i || i === e))
        return r;
      t = i;
    }
  }
  var ei = class extends qe {
    constructor(e, t) {
      super();
      __publicField(this, "element");
      __publicField(this, "rendering");
      this._parent = e, this.element = document.createElement("div"), this.element.className = "md-cursor", this.rendering = Oe(this, (s) => {
        const i = s.readObservable(t.offset), r = s.readObservable(t.visualLineMap);
        if (i === void 0 || r.isEmpty)
          return this.element.style.display = "none", new yt(i ?? 0, false, R2.EMPTY);
        const o2 = r.lineIndexOfOffset(i), c2 = r.lineRect(o2).withZeroWidthAt(r.xAtOffset(i)), l2 = this._parent.getBoundingClientRect(), a = c2.translate(-l2.left, -l2.top);
        return this.element.style.left = `${a.x}px`, this.element.style.top = `${a.y}px`, this.element.style.height = `${a.height}px`, this.element.style.display = "", new yt(i, true, a);
      }), this._register(L((s) => {
        s.readObservable(this.rendering);
      })), this._register(L((s) => {
        s.readObservable(t.offset), this.element.style.animation = "none", this.element.offsetWidth, this.element.style.animation = "";
      }));
    }
  };
  var yt = class {
    constructor(e, t, s) {
      this.offset = e, this.visible = t, this.rect = s;
    }
  };
  var ti = class extends qe {
    constructor(e, t) {
      super();
      __publicField(this, "element");
      __publicField(this, "rendering");
      __publicField(this, "_path");
      this._parent = e, this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.element.setAttribute("class", "md-selection-layer"), this._path = document.createElementNS("http://www.w3.org/2000/svg", "path"), this._path.setAttribute("class", "md-selection-path"), this.element.appendChild(this._path), this.rendering = Oe(this, (s) => {
        const i = s.readObservable(t.selection), r = s.readObservable(t.visualLineMap), o2 = s.readObservable(t.blocks);
        return ni(this._path, this._parent, i, r, o2);
      }), this._register(L((s) => {
        s.readObservable(this.rendering);
      }));
    }
  };
  var Et = class {
    constructor(e) {
      this.rects = e;
    }
  };
  function ni(n, e, t, s, i) {
    if (!t || t.isCollapsed)
      return n.setAttribute("d", ""), new Et([]);
    const r = t.range, o2 = e.getBoundingClientRect(), c2 = [];
    for (const d of s.lines) {
      const f2 = Zt(d);
      if (!f2 || !r.intersects(f2))
        continue;
      const p2 = i.find((m2) => _2.ofStartAndLength(m2.absoluteStart, m2.block.length).containsRange(f2));
      c2.push({ line: d, lineRange: f2, block: p2 });
    }
    const l2 = [], a = [];
    for (let d = 0; d < c2.length; d++) {
      const { line: f2, lineRange: p2 } = c2[d], m2 = d === 0, w = d === c2.length - 1, v2 = m2 ? f2.xAtOffset(Math.max(r.start, p2.start)) : f2.rect.left, I2 = w ? f2.xAtOffset(Math.min(r.endExclusive, p2.endExclusive)) : f2.rect.right;
      l2.push({
        x: v2 - o2.left,
        y: f2.rect.top - o2.top,
        width: Math.max(0, I2 - v2),
        height: f2.rect.height
      }), a.push({ left: v2, right: I2, top: f2.rect.top, bottom: f2.rect.top + f2.rect.height });
    }
    for (let d = 0; d < a.length - 1; d++) {
      const f2 = a[d], p2 = a[d + 1];
      if (p2.top <= f2.bottom)
        continue;
      const m2 = Math.max(f2.left, p2.left), w = Math.min(f2.right, p2.right);
      w <= m2 || l2.push({
        x: m2 - o2.left,
        y: f2.bottom - o2.top,
        width: w - m2,
        height: p2.top - f2.bottom
      });
    }
    const h = /* @__PURE__ */ new Map(), g2 = /* @__PURE__ */ new Map();
    for (let d = 0; d < c2.length; d++) {
      const f2 = c2[d].block;
      f2 && (h.has(f2) || h.set(f2, d), g2.set(f2, d));
    }
    const u2 = i.map(
      (d) => r.intersects(_2.ofStartAndLength(d.absoluteStart, d.block.length))
    );
    for (let d = 0; d < i.length - 1; d++) {
      const f2 = i[d], p2 = i[d + 1], m2 = f2.absoluteStart + f2.block.length, w = p2.absoluteStart;
      if (m2 < w && !r.containsRange(_2.fromTo(m2, w)) || m2 >= w && !(u2[d] && u2[d + 1]))
        continue;
      const v2 = f2.element.getBoundingClientRect(), I2 = p2.element.getBoundingClientRect(), X = si(s, p2, I2.top), q2 = v2.bottom;
      if (X <= q2)
        continue;
      const ce2 = g2.get(f2), Ge2 = h.get(p2), ze2 = ce2 !== void 0 ? a[ce2] : { left: v2.left, right: v2.right }, Xe2 = Ge2 !== void 0 ? a[Ge2] : { left: I2.left, right: I2.right }, Ce2 = Math.max(ze2.left, Xe2.left), Qe2 = Math.min(ze2.right, Xe2.right);
      Qe2 <= Ce2 || l2.push({
        x: Ce2 - o2.left,
        y: q2 - o2.top,
        width: Qe2 - Ce2,
        height: X - q2
      });
    }
    for (const d of i) {
      const f2 = _2.ofStartAndLength(d.absoluteStart, d.block.length);
      if (!r.intersects(f2))
        continue;
      let p2 = false;
      for (const { lineRange: w } of c2)
        if (w.intersects(f2)) {
          p2 = true;
          break;
        }
      if (p2)
        continue;
      const m2 = d.element.getBoundingClientRect();
      l2.push({
        x: m2.left - o2.left,
        y: m2.top - o2.top,
        width: m2.width,
        height: m2.height
      });
    }
    return n.setAttribute("d", ii(l2, 4)), new Et(l2);
  }
  function Zt(n) {
    if (n.runs.length === 0)
      return;
    let e = 1 / 0, t = -1 / 0;
    for (const s of n.runs)
      s.sourceStart < e && (e = s.sourceStart), s.sourceEndExclusive > t && (t = s.sourceEndExclusive);
    return _2.fromTo(e, t);
  }
  function si(n, e, t) {
    const s = _2.ofStartAndLength(e.absoluteStart, e.block.length);
    for (const i of n.lines) {
      const r = Zt(i);
      if (r && s.containsRange(r))
        return i.rect.top;
    }
    return t;
  }
  function ii(n, e) {
    if (n.length === 0)
      return "";
    const t = n.slice().sort((r, o2) => r.y - o2.y || r.x - o2.x), s = [];
    let i = [];
    for (const r of t) {
      const o2 = i[i.length - 1], c2 = o2 !== void 0 && r.y <= o2.y + o2.height + 0.5, l2 = o2 !== void 0 && Math.max(o2.x, r.x) < Math.min(o2.x + o2.width, r.x + r.width);
      c2 && l2 ? i.push(r) : (i.length > 0 && s.push(i), i = [r]);
    }
    return i.length > 0 && s.push(i), s.map((r) => ri(r, e)).filter(Boolean).join(" ");
  }
  function ri(n, e) {
    const t = [];
    t.push({ x: n[0].x + n[0].width, y: n[0].y, convex: true });
    for (let i = 0; i < n.length - 1; i++) {
      const r = n[i], o2 = n[i + 1], c2 = r.x + r.width, l2 = o2.x + o2.width;
      if (Math.abs(c2 - l2) > 0.5) {
        const a = r.y + r.height, h = c2 > l2;
        t.push({ x: c2, y: a, convex: h }), t.push({ x: l2, y: a, convex: !h });
      }
    }
    const s = n[n.length - 1];
    t.push({ x: s.x + s.width, y: s.y + s.height, convex: true }), t.push({ x: s.x, y: s.y + s.height, convex: true });
    for (let i = n.length - 1; i > 0; i--) {
      const r = n[i], o2 = n[i - 1];
      if (Math.abs(r.x - o2.x) > 0.5) {
        const c2 = r.y, l2 = r.x < o2.x;
        t.push({ x: r.x, y: c2, convex: l2 }), t.push({ x: o2.x, y: c2, convex: !l2 });
      }
    }
    return t.push({ x: n[0].x, y: n[0].y, convex: true }), oi(t, e);
  }
  function oi(n, e) {
    const t = n.length;
    if (t < 3)
      return "";
    const s = new Array(t);
    for (let o2 = 0; o2 < t; o2++) {
      const c2 = n[(o2 + t - 1) % t], l2 = n[(o2 + 1) % t], a = xe2(n[o2], c2), h = xe2(n[o2], l2);
      s[o2] = Math.min(e, a / 2, h / 2);
    }
    const i = Se2(n[t - 1], n[0], xe2(n[t - 1], n[0]) - s[0]), r = [`M${D3(i.x)},${D3(i.y)}`];
    for (let o2 = 0; o2 < t; o2++) {
      const c2 = n[o2], l2 = n[(o2 + 1) % t], a = s[o2], h = Se2(c2, l2, a);
      a > 0 ? r.push(`A${D3(a)},${D3(a)} 0 0 ${c2.convex ? 1 : 0} ${D3(h.x)},${D3(h.y)}`) : r.push(`L${D3(h.x)},${D3(h.y)}`);
      const g2 = s[(o2 + 1) % t], u2 = Se2(c2, l2, xe2(c2, l2) - g2);
      r.push(`L${D3(u2.x)},${D3(u2.y)}`);
    }
    return r.push("Z"), r.join(" ");
  }
  function xe2(n, e) {
    return Math.hypot(n.x - e.x, n.y - e.y);
  }
  function Se2(n, e, t) {
    const s = e.x - n.x, i = e.y - n.y, r = Math.hypot(s, i);
    if (r === 0)
      return { x: n.x, y: n.y };
    const o2 = t / r;
    return { x: n.x + s * o2, y: n.y + i * o2 };
  }
  function D3(n) {
    return n.toFixed(2);
  }
  var Ii = class extends qe {
    constructor(e, t) {
      super();
      __publicField(this, "element");
      __publicField(this, "editContext");
      __publicField(this, "measuredLayout");
      __publicField(this, "_cursorView");
      __publicField(this, "_selectionView");
      /**
       * The mounted block sequence, in source order. Rebuilt (not mutated) each
       * frame by {@link DocumentViewNode.create}; the view just swaps one
       * immutable node for the next. Never used for source-of-truth lookups
       * (those go through the measured-layout model).
       */
      __publicField(this, "_document", z(this, void 0));
      /**
       * Last frame's view-data overlay, threaded back into
       * {@link buildDocumentViewData} so any subtree whose ast and selection flags
       * are unchanged keeps its view-data object — which lets the renderer reuse
       * its DOM by identity.
       */
      __publicField(this, "_previousViewData");
      /** The current view-data tree (AST overlaid with selection flags), for debugging. */
      __publicField(this, "_viewData", z(this, void 0));
      /**
       * The block cache projected for views (selection painting) that need to
       * react to mount/unmount. Derived from {@link _document}, so it stays in
       * lock-step without any manual bookkeeping.
       */
      __publicField(this, "_selectionBlocksObs", Oe(this, (e) => {
        const t = this._document.read(e);
        return t ? t.blocks.map((s) => ({
          block: s.node.block,
          absoluteStart: s.absoluteStart,
          viewNode: s.node,
          element: s.node.element
        })) : [];
      }));
      // ----- render autorun ------------------------------------------------
      __publicField(this, "_renderAutorun", (e) => {
        const t = e.readObservable(this._model.document), s = e.readObservable(this._model.sourceText).value, i = e.readObservable(this._model.activeBlocks), r = e.readObservable(this._model.selection);
        this.editContext.text !== s && this.editContext.updateText(0, this.editContext.text.length, s);
        const o2 = this._document.get(), c2 = Qt(t, i, r?.range, this._previousViewData);
        this._previousViewData = c2, this._viewData.set(c2, void 0);
        const l2 = je2.create(c2, this._options, o2);
        if (o2) {
          if (l2.contentDomNode !== o2.contentDomNode)
            throw new Error("DocumentViewNode.contentDomNode must be stable across rebuilds");
        } else
          this.element.insertBefore(l2.contentDomNode, this.element.firstChild);
        this._document.set(l2, void 0), this._publishMeasurements(l2);
      });
      this._model = e, this._options = t, this.element = document.createElement("div"), this.element.className = "md-editor", this._options?.classNames && this.element.classList.add(...this._options.classNames), this.element.tabIndex = 0, this.measuredLayout = new Pn(), this._selectionView = this._register(new ti(this.element, {
        selection: this._model.selection,
        visualLineMap: this.measuredLayout.visualLineMap,
        blocks: this._selectionBlocksObs
      })), this.element.appendChild(this._selectionView.element), this._cursorView = this._register(new ei(this.element, {
        offset: this._model.cursorOffset,
        visualLineMap: this.measuredLayout.visualLineMap
      })), this.element.appendChild(this._cursorView.element), this.editContext = new EditContext({
        text: this._model.sourceText.get().value,
        selectionStart: 0,
        selectionEnd: 0
      }), this.element.editContext = this.editContext, this._register(L(this._renderAutorun)), this._register(L((s) => {
        const i = s.readObservable(this._model.selection)?.range;
        this.editContext.updateSelection(i?.start ?? 0, i?.endExclusive ?? 0);
      })), this._register({ dispose: () => {
        this._document.get()?.dispose();
      } });
    }
    /** The current view-node tree (AST overlaid with rendered DOM), for debugging. */
    get documentViewNode() {
      return this._document;
    }
    get viewData() {
      return this._viewData;
    }
    focus() {
      this.element.focus({ preventScroll: true });
    }
    /**
     * Client coordinates → absolute source offset (any block). Used during
     * drag to keep extending the selection even when the pointer leaves the
     * original block.
     */
    resolveOffsetFromPoint(e) {
      const t = bs(e);
      if (t)
        return this._document.get()?.resolveSource(t);
    }
    /**
     * Whether a client point falls on the rendered document content, as
     * opposed to the surrounding editor padding (the green area). Uses DOM
     * containment rather than the content node's bounding box so that markers
     * which overflow into the padding (e.g. a heading's `##`, which renders in
     * the left margin) still count as content. Overlays (cursor, selection)
     * have `pointer-events: none`, so the hit-test sees through them.
     */
    isPointInContent(e) {
      const t = this._document.get()?.contentDomNode;
      if (!t)
        return false;
      const s = document.elementFromPoint(e.x, e.y);
      return s !== null && t.contains(s);
    }
    /** Current mounted blocks, or empty before the first render. */
    get _blocks() {
      return this._document.get()?.blocks ?? [];
    }
    /**
     * Measure each mounted block's rect and per-block visual line map, then
     * publish the result into the {@link MeasuredLayoutModel}. The model
     * is not read here, so there is no feedback loop into the render autorun.
     */
    _publishMeasurements(e) {
      const t = [];
      for (const s of e.blocks) {
        const i = s.node.element.getBoundingClientRect();
        s.node.recordMeasuredHeight(i.height);
        const r = _e2.measure([{
          absoluteStart: s.absoluteStart,
          viewNode: s.node
        }]);
        t.push({
          block: s.node.block,
          absoluteStart: s.absoluteStart,
          height: i.height,
          isMeasured: true,
          visualLineMap: r,
          viewNode: s.node
        });
      }
      this.measuredLayout.measurements.set(t, void 0);
    }
  };
  var Bi = class extends qe {
    constructor(e, t) {
      super();
      __publicField(this, "_desiredColumn");
      __publicField(this, "_handleTextUpdate", (e) => {
        const t = y2.replace(
          new _2(e.updateRangeStart, e.updateRangeEnd),
          e.text
        );
        this._model.applyEdit(t);
      });
      __publicField(this, "_handleMouseDown", (e) => {
        e.preventDefault(), this._view.focus(), this._desiredColumn = void 0;
        const t = new ee2(e.clientX, e.clientY);
        if (!this._view.isPointInContent(t)) {
          this._model.selection.set(void 0, void 0);
          return;
        }
        const s = this._view.resolveOffsetFromPoint(t) ?? this._model.sourceText.get().value.length;
        if (e.detail === 2) {
          const o2 = this._makeCursorContext();
          this._model.selection.set(ls(o2, s), void 0);
          return;
        }
        if (e.detail === 3) {
          const o2 = ci(this._model.document.get(), s);
          o2 && this._model.selection.set(as(this._makeCursorContext(), o2), void 0);
          return;
        }
        if (e.shiftKey) {
          const o2 = this._model.selection.get() ?? x2.collapsed(s);
          this._model.selection.set(o2.withActive(s), void 0);
        } else
          this._model.selection.set(x2.collapsed(s), void 0);
        const i = (o2) => {
          const c2 = this._model.selection.get() ?? x2.collapsed(s), l2 = this._view.resolveOffsetFromPoint(new ee2(o2.clientX, o2.clientY)) ?? c2.active;
          this._model.selection.set(new x2(c2.anchor, l2), void 0);
        }, r = () => {
          document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", r);
        };
        document.addEventListener("mousemove", i), document.addEventListener("mouseup", r);
      });
      __publicField(this, "_handleCopy", (e) => {
        const t = this._selectedText();
        t !== void 0 && (e.preventDefault(), e.clipboardData?.setData("text/plain", t));
      });
      __publicField(this, "_handleCut", (e) => {
        const t = this._selectedText();
        t !== void 0 && (e.preventDefault(), e.clipboardData?.setData("text/plain", t), this._executeEditCommand(it));
      });
      __publicField(this, "_handlePaste", (e) => {
        e.preventDefault();
        const t = e.clipboardData?.getData("text/plain");
        t && this._executeEditCommand(ss(t));
      });
      __publicField(this, "_handleKeyDown", (e) => {
        const t = e.ctrlKey || e.metaKey;
        if (e.key === "ArrowLeft")
          e.preventDefault(), t ? this._executeCursorCommand((e.shiftKey, tt), e.shiftKey) : e.shiftKey ? this._executeCursorCommand(Xn, true) : this._executeCursorCommand(Gn, false);
        else if (e.key === "ArrowRight")
          e.preventDefault(), t ? this._executeCursorCommand(Qn, e.shiftKey) : e.shiftKey ? this._executeCursorCommand(zn, true) : this._executeCursorCommand(jn, false);
        else if (e.key === "ArrowUp")
          e.preventDefault(), this._executeVisualCursorCommand(st, e.shiftKey);
        else if (e.key === "ArrowDown")
          e.preventDefault(), this._executeVisualCursorCommand(nt, e.shiftKey);
        else if (e.key === "Home")
          e.preventDefault(), t ? this._executeCursorCommand(Jn, e.shiftKey) : this._executeCursorCommand(Un, e.shiftKey);
        else if (e.key === "End")
          e.preventDefault(), t ? this._executeCursorCommand(Zn, e.shiftKey) : this._executeCursorCommand(Yn, e.shiftKey);
        else if (e.key === "a" && t) {
          e.preventDefault();
          const s = this._makeCursorContext();
          this._model.selection.set(cs(s), void 0);
        } else e.key === "Backspace" ? (e.preventDefault(), this._executeEditCommand(t ? ts : it)) : e.key === "Delete" ? (e.preventDefault(), this._executeEditCommand(t ? ns : es)) : e.key === "Enter" && (e.preventDefault(), this._executeEditCommand(t ? is : e.shiftKey ? os : rs));
      });
      this._model = e, this._view = t;
      const s = this._view.element;
      s.addEventListener("mousedown", this._handleMouseDown), s.addEventListener("keydown", this._handleKeyDown), s.addEventListener("copy", this._handleCopy), s.addEventListener("cut", this._handleCut), s.addEventListener("paste", this._handlePaste), this._register({
        dispose: () => {
          s.removeEventListener("mousedown", this._handleMouseDown), s.removeEventListener("keydown", this._handleKeyDown), s.removeEventListener("copy", this._handleCopy), s.removeEventListener("cut", this._handleCut), s.removeEventListener("paste", this._handlePaste);
        }
      });
      const i = this._view.editContext;
      i.addEventListener("textupdate", this._handleTextUpdate), this._register({
        dispose: () => i.removeEventListener("textupdate", this._handleTextUpdate)
      });
    }
    _makeCursorContext() {
      return {
        text: this._model.sourceText.get().value,
        selection: this._model.selection.get() ?? x2.collapsed(0),
        document: this._model.document.get(),
        activeBlock: this._model.activeBlock.get()
      };
    }
    _makeVisualCursorContext() {
      return {
        ...this._makeCursorContext(),
        desiredColumn: this._desiredColumn,
        lineMap: this._view.measuredLayout.visualLineMap.get()
      };
    }
    _executeCursorCommand(e, t) {
      const s = this._makeCursorContext(), i = e(s), r = s.selection;
      this._model.selection.set(
        t ? r.withActive(i) : x2.collapsed(i),
        void 0
      ), this._desiredColumn = void 0;
    }
    _executeEditCommand(e) {
      const t = this._makeCursorContext(), s = e(t);
      s && (this._model.applyEdit(s.edit), this._desiredColumn = void 0);
    }
    _executeVisualCursorCommand(e, t) {
      const s = this._makeVisualCursorContext(), i = e(s);
      this._model.selection.set(
        t ? s.selection.withActive(i.offset) : x2.collapsed(i.offset),
        void 0
      ), this._desiredColumn = i.desiredColumn;
    }
    /** Move the cursor down one visual line (Arrow Down). */
    cursorDown(e = false) {
      this._executeVisualCursorCommand(nt, e);
    }
    /** Move the cursor up one visual line (Arrow Up). */
    cursorUp(e = false) {
      this._executeVisualCursorCommand(st, e);
    }
    _selectedText() {
      const e = this._model.selection.get();
      if (!(!e || e.isCollapsed))
        return this._model.sourceText.get().value.slice(e.range.start, e.range.endExclusive);
    }
  };
  function ci(n, e) {
    let t = 0;
    for (const s of n.children) {
      if (n.blocks.includes(s)) {
        const i = _2.ofStartAndLength(t, s.length);
        if (i.contains(e) || i.endExclusive === e)
          return i;
      }
      t += s.length;
    }
  }

  // webview/main.ts
  function readInitialState() {
    const element2 = document.querySelector('meta[name="github-style-markdown-editor-initial-state"]');
    if (!element2) {
      throw new Error("Markdown editor initial state was not found.");
    }
    element2.remove();
    const value = JSON.parse(decodeURIComponent(element2.content));
    const candidate = value;
    if (typeof candidate?.content !== "string") {
      throw new Error("Markdown editor initial state is invalid.");
    }
    return { content: candidate.content, documentVersion: candidate.documentVersion ?? 0 };
  }
  function computeTextEdit(previousText, text4) {
    if (previousText === text4) {
      return void 0;
    }
    let start = 0;
    while (start < previousText.length && start < text4.length && previousText.charCodeAt(start) === text4.charCodeAt(start)) {
      start++;
    }
    let previousEnd = previousText.length;
    let end = text4.length;
    while (previousEnd > start && end > start && previousText.charCodeAt(previousEnd - 1) === text4.charCodeAt(end - 1)) {
      previousEnd--;
      end--;
    }
    return {
      start,
      endExclusive: previousEnd,
      text: text4.slice(start, end)
    };
  }
  var _isUpdatingFromHost, _previousText, _GithubStyleEditor_instances, setCaretToEnd_fn;
  var GithubStyleEditor = class {
    constructor(host, initial) {
      __privateAdd(this, _GithubStyleEditor_instances);
      __publicField(this, "model", new Ni());
      __privateAdd(this, _isUpdatingFromHost, false);
      __privateAdd(this, _previousText);
      const vscode = acquireVsCodeApi();
      __privateSet(this, _previousText, initial.content);
      this.model.sourceText.set(new Oe2(initial.content), void 0);
      const view = new Ii(this.model, {
        classNames: ["github-markdown-theme"],
        onOpenLink: (url) => {
          vscode.postMessage({ type: "openLink", href: url });
        }
      });
      new Bi(this.model, view);
      host.appendChild(view.element);
      __privateMethod(this, _GithubStyleEditor_instances, setCaretToEnd_fn).call(this, initial.content);
      window.addEventListener("message", (event) => {
        const message = event.data;
        if (message?.type !== "content" || typeof message.content !== "string") {
          return;
        }
        __privateSet(this, _isUpdatingFromHost, true);
        try {
          this.model.sourceText.set(new Oe2(message.content), void 0);
          __privateMethod(this, _GithubStyleEditor_instances, setCaretToEnd_fn).call(this, message.content);
        } finally {
          __privateSet(this, _isUpdatingFromHost, false);
        }
        __privateSet(this, _previousText, message.content);
      });
      L((reader) => {
        const text4 = reader.readObservable(this.model.sourceText).value;
        if (__privateGet(this, _isUpdatingFromHost)) {
          return;
        }
        const edit = computeTextEdit(__privateGet(this, _previousText), text4);
        if (edit) {
          vscode.postMessage({ type: "edit", ...edit });
        }
        __privateSet(this, _previousText, text4);
      });
      window.addEventListener("keydown", (event) => {
        const hasMeta = event.ctrlKey || event.metaKey;
        if (!hasMeta || event.key !== "z") {
          return;
        }
        event.preventDefault();
        vscode.postMessage({ type: event.shiftKey ? "redo" : "undo" });
      });
      const saved = vscode.getState() ?? {};
      if (typeof saved.scrollTop === "number" && saved.scrollTop > 0) {
        requestAnimationFrame(() => {
          host.scrollTop = saved.scrollTop;
        });
      }
      let scrollSaveScheduled = false;
      const saveScroll = () => {
        if (scrollSaveScheduled) {
          return;
        }
        scrollSaveScheduled = true;
        requestAnimationFrame(() => {
          scrollSaveScheduled = false;
          vscode.setState({ scrollTop: host.scrollTop });
        });
      };
      host.addEventListener("scroll", saveScroll, { passive: true });
      window.addEventListener("pagehide", () => {
        vscode.setState({ scrollTop: host.scrollTop });
      });
    }
  };
  _isUpdatingFromHost = new WeakMap();
  _previousText = new WeakMap();
  _GithubStyleEditor_instances = new WeakSet();
  setCaretToEnd_fn = function(content3) {
    this.model.selection.set(new x2(content3.length, content3.length), void 0);
  };
  new GithubStyleEditor(document.getElementById("editor"), readInitialState());
})();
