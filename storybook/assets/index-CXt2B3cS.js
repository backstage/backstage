import{j as n}from"./jsx-runtime-CvpxdxdE.js";import{r as m}from"./index-DSHF18-l.js";import{u as I}from"./useAsync-W0CErRou.js";import{a as J}from"./Link-DmlXjQke.js";import{h as q}from"./translation-BXIQMXQD.js";import{m as j}from"./makeStyles-yUUo8jj4.js";import{e as L,a as S}from"./routes-C1LmTt2S.js";import{L as N}from"./ListItem-DZU9uVXE.js";import{L as M}from"./ListItemIcon-Cl65eXMu.js";import{L as D}from"./ListItemText-Bhrk3tXi.js";import{E as O}from"./EntityDisplayName-C6zCeBj0.js";import{u as C}from"./useRouteRef-clHAB9KK.js";import{u as A}from"./useTranslationRef-m705PC51.js";import{F as K}from"./FavoriteToggle-D8nFC1Cg.js";import{c as P}from"./api-Co_hnf76.js";import{u as U}from"./WebStorage-BMQO-dXK.js";import{s as V}from"./StarredEntitiesApi-BF15pUWO.js";import{u as x}from"./ApiRef-DDVPwL0h.js";import{s as f}from"./ref-8pKZtiZi.js";import{T as z}from"./Typography-C4wK928C.js";import{L as T}from"./List-q1Ps7jPn.js";import{T as _,a as F}from"./Tabs-BdK99h7M.js";import{P as $}from"./Progress-BxADJwWm.js";import{R as B}from"./ResponseErrorPanel-BWpwzcuy.js";import"./useMountedState-BK0Y35lN.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./index-CEhUYg2U.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./capitalize-Bw5a1ocu.js";import"./defaultTheme-DT8oR2d2.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./useAnalytics-BqSe3k6a.js";import"./ConfigApi-1QFqvuIK.js";import"./TranslationApi-NYdUF01F.js";import"./appWrappers-Ce-h3mhN.js";import"./MockTranslationApi-CqZA_upk.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BaoXGylq.js";import"./toArray-BGA7wbLE.js";import"./index-D9gx4uDp.js";import"./componentData-CNQluCuE.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./index-B0bGgVUV.js";import"./ThemeProvider-BZpfpFrZ.js";import"./CssBaseline-DWDV0Ah6.js";import"./palettes-Bwgvserk.js";import"./ListContext-u-bsdFbB.js";import"./ButtonBase-CsQ2zz2r.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./Box-CBL4LtOb.js";import"./typography-BTdCO-e1.js";import"./Tooltip-BZbacX7V.js";import"./useTheme-DT5kHe_T.js";import"./Popper-B4Xi0-98.js";import"./Portal-Dl07bpo2.js";import"./Grow-CSLyW-xI.js";import"./utils-BnkjTVkr.js";import"./IconButton-Ckj9xv_i.js";import"./icons-BT-7R_NK.js";import"./react-is.production.min-D0tnNtx9.js";import"./KeyboardArrowRight-DEvPZzLx.js";import"./LinearProgress-BCsCCsq_.js";import"./ErrorPanel-DbDxoT0S.js";import"./WarningPanel-BnAoPbjT.js";import"./ExpandMore-CpC1TpJa.js";import"./AccordionDetails-BzKcYNPh.js";import"./Paper-B3vUppvp.js";import"./Collapse-CcPiBY5d.js";import"./MarkdownContent-C4Pyp6BQ.js";import"./CodeSnippet-ETnlsjwF.js";import"./iframe-m0_FoAsG.js";import"./objectWithoutProperties-Et-85jJS.js";import"./toConsumableArray-BEwiObev.js";import"./CopyTextButton-kLpyVwum.js";import"./useCopyToClipboard-35MWAbE5.js";import"./translation-DexOCuBa.js";import"./Grid-BY2EZ_z9.js";import"./Divider-CQVpOw77.js";function k(e){return typeof e=="string"?e:f(e)}function G(){const e=x(V),a=U(m.useMemo(()=>e.starredEntitie$(),[e]),new Set),s=m.useCallback(r=>a.has(k(r)),[a]),l=m.useCallback(r=>e.toggleStarred(k(r)).then(),[e]);return{starredEntities:a,toggleStarredEntity:l,isStarredEntity:s}}const H=j(e=>({listItem:{paddingBottom:e.spacing(0),paddingTop:e.spacing(0)},secondary:{textTransform:"uppercase"}})),y=({entity:e,onToggleStarredEntity:a,showKind:s})=>{const l=H(),r=C(L),{t:h}=A(q);let o="";return s&&(o+=e.kind.toLocaleLowerCase("en-US")),e.spec&&"type"in e.spec&&(s&&(o+=" — "),o+=e.spec.type.toLocaleLowerCase("en-US")),n.jsxs(N,{dense:!0,className:l.listItem,component:J,button:!0,to:r(S(e)),children:[n.jsx(M,{onClick:u=>{u.preventDefault()},children:n.jsx(K,{id:`remove-favorite-${e.metadata.uid}`,title:h("starredEntityListItem.removeFavoriteEntityTitle"),isFavorite:!0,onToggle:()=>a(e)})}),n.jsx(D,{primary:n.jsx(O,{hideIcon:!0,entityRef:e}),secondary:o})]})};y.__docgenInfo={description:"",methods:[],displayName:"StarredEntityListItem",props:{entity:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];
}`,signature:{properties:[{key:"apiVersion",value:{name:"string",required:!0},description:`The version of specification format for this particular entity that
this is written against.`},{key:"kind",value:{name:"string",required:!0},description:"The high level entity type being described."},{key:"metadata",value:{name:"intersection",raw:`JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,elements:[{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},{name:"signature",type:"object",raw:`{
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,signature:{properties:[{key:"uid",value:{name:"string",required:!1},description:`A globally unique ID for the entity.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, but the server is free to reject requests
that do so in such a way that it breaks semantics.`},{key:"etag",value:{name:"string",required:!1},description:`An opaque string that changes for each update operation to any part of
the entity, including metadata.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, and the server will then reject the
operation if it does not match the current stored value.`},{key:"name",value:{name:"string",required:!0},description:`The name of the entity.

Must be unique within the catalog at any given point in time, for any
given namespace + kind pair. This value is part of the technical
identifier of the entity, and as such it will appear in URLs, database
tables, entity references, and similar. It is subject to restrictions
regarding what characters are allowed.

If you want to use a different, more human readable string with fewer
restrictions on it in user interfaces, see the \`title\` field below.`},{key:"namespace",value:{name:"string",required:!1},description:"The namespace that the entity belongs to."},{key:"title",value:{name:"string",required:!1},description:`A display name of the entity, to be presented in user interfaces instead
of the \`name\` property above, when available.

This field is sometimes useful when the \`name\` is cumbersome or ends up
being perceived as overly technical. The title generally does not have
as stringent format requirements on it, so it may contain special
characters and be more explanatory. Do keep it very short though, and
avoid situations where a title can be confused with the name of another
entity, or where two entities share a title.

Note that this is only for display purposes, and may be ignored by some
parts of the code. Entity references still always make use of the \`name\`
property, not the title.`},{key:"description",value:{name:"string",required:!1},description:`A short (typically relatively few words, on one line) description of the
entity.`},{key:"labels",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:"Key/value pairs of identifying information attached to the entity."},{key:"annotations",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:`Key/value pairs of non-identifying auxiliary information attached to the
entity.`},{key:"tags",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1},description:`A list of single-valued strings, to for example classify catalog entities in
various ways.`},{key:"links",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;

  /**
   * An optional value to categorize links into specific groups
   */
  type?: string;
}`,signature:{properties:[{key:"url",value:{name:"string",required:!0},description:"The url to the external site, document, etc."},{key:"title",value:{name:"string",required:!1},description:"An optional descriptive title for the link."},{key:"icon",value:{name:"string",required:!1},description:"An optional semantic key that represents a visual icon."},{key:"type",value:{name:"string",required:!1},description:"An optional value to categorize links into specific groups"}]}}],raw:"EntityLink[]",required:!1},description:"A list of external hyperlinks related to the entity."}]}}],required:!0},description:"Metadata related to the entity."},{key:"spec",value:{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},description:"The specification data describing the entity itself."},{key:"relations",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The entity ref of the target of this relation.
   */
  targetRef: string;
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},onToggleStarredEntity:{required:!0,tsType:{name:"signature",type:"function",raw:"(entity: Entity) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];
}`,signature:{properties:[{key:"apiVersion",value:{name:"string",required:!0},description:`The version of specification format for this particular entity that
this is written against.`},{key:"kind",value:{name:"string",required:!0},description:"The high level entity type being described."},{key:"metadata",value:{name:"intersection",raw:`JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,elements:[{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},{name:"signature",type:"object",raw:`{
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,signature:{properties:[{key:"uid",value:{name:"string",required:!1},description:`A globally unique ID for the entity.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, but the server is free to reject requests
that do so in such a way that it breaks semantics.`},{key:"etag",value:{name:"string",required:!1},description:`An opaque string that changes for each update operation to any part of
the entity, including metadata.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, and the server will then reject the
operation if it does not match the current stored value.`},{key:"name",value:{name:"string",required:!0},description:`The name of the entity.

Must be unique within the catalog at any given point in time, for any
given namespace + kind pair. This value is part of the technical
identifier of the entity, and as such it will appear in URLs, database
tables, entity references, and similar. It is subject to restrictions
regarding what characters are allowed.

If you want to use a different, more human readable string with fewer
restrictions on it in user interfaces, see the \`title\` field below.`},{key:"namespace",value:{name:"string",required:!1},description:"The namespace that the entity belongs to."},{key:"title",value:{name:"string",required:!1},description:`A display name of the entity, to be presented in user interfaces instead
of the \`name\` property above, when available.

This field is sometimes useful when the \`name\` is cumbersome or ends up
being perceived as overly technical. The title generally does not have
as stringent format requirements on it, so it may contain special
characters and be more explanatory. Do keep it very short though, and
avoid situations where a title can be confused with the name of another
entity, or where two entities share a title.

Note that this is only for display purposes, and may be ignored by some
parts of the code. Entity references still always make use of the \`name\`
property, not the title.`},{key:"description",value:{name:"string",required:!1},description:`A short (typically relatively few words, on one line) description of the
entity.`},{key:"labels",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:"Key/value pairs of identifying information attached to the entity."},{key:"annotations",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:`Key/value pairs of non-identifying auxiliary information attached to the
entity.`},{key:"tags",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1},description:`A list of single-valued strings, to for example classify catalog entities in
various ways.`},{key:"links",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;

  /**
   * An optional value to categorize links into specific groups
   */
  type?: string;
}`,signature:{properties:[{key:"url",value:{name:"string",required:!0},description:"The url to the external site, document, etc."},{key:"title",value:{name:"string",required:!1},description:"An optional descriptive title for the link."},{key:"icon",value:{name:"string",required:!1},description:"An optional semantic key that represents a visual icon."},{key:"type",value:{name:"string",required:!1},description:"An optional value to categorize links into specific groups"}]}}],raw:"EntityLink[]",required:!1},description:"A list of external hyperlinks related to the entity."}]}}],required:!0},description:"Metadata related to the entity."},{key:"spec",value:{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},description:"The specification data describing the entity itself."},{key:"relations",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The entity ref of the target of this relation.
   */
  targetRef: string;
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},name:"entity"}],return:{name:"void"}}},description:""},showKind:{required:!1,tsType:{name:"boolean"},description:""}}};const Q=j(e=>({tabs:{marginBottom:e.spacing(1)},list:{paddingTop:0,paddingBottom:0}})),W=({noStarredEntitiesMessage:e,groupByKind:a})=>{var b,v;const s=Q(),l=x(P),{starredEntities:r,toggleStarredEntity:h}=G(),[o,u]=m.useState(0),{t:E}=A(q),p=I(async()=>r.size?(await l.getEntitiesByRefs({entityRefs:[...r],fields:["kind","metadata.namespace","metadata.name","spec.type","metadata.title","spec.profile.displayName"]})).items.filter(t=>!!t):[],[l,r]);if(r.size===0)return n.jsx(z,{variant:"body1",children:e||E("starredEntities.noStarredEntitiesMessage")});if(p.loading)return n.jsx($,{});const c={};(b=p.value)==null||b.forEach(t=>{const i=t.kind;c[i]||(c[i]=[]),c[i].push(t)});const g=Object.entries(c);return p.error?n.jsx(B,{error:p.error}):n.jsxs("div",{children:[!a&&n.jsx(T,{className:s.list,children:(v=p.value)==null?void 0:v.sort((t,i)=>(t.metadata.title??t.metadata.name).localeCompare(i.metadata.title??i.metadata.name)).map(t=>n.jsx(y,{entity:t,onToggleStarredEntity:h,showKind:!0},f(t)))}),a&&n.jsx(_,{className:s.tabs,value:o,onChange:(t,i)=>u(i),variant:"scrollable",scrollButtons:"auto","aria-label":"entity-tabs",children:g.map(([t])=>n.jsx(F,{label:t},t))}),a&&g.map(([t,i],R)=>n.jsx("div",{hidden:a&&o!==R,children:n.jsx(T,{className:s.list,children:i==null?void 0:i.sort((d,w)=>(d.metadata.title??d.metadata.name).localeCompare(w.metadata.title??w.metadata.name)).map(d=>n.jsx(y,{entity:d,onToggleStarredEntity:h,showKind:!1},f(d)))})},t))]})};W.__docgenInfo={description:`A component to display a list of starred entities for the user.

@public`,methods:[],displayName:"Content",props:{noStarredEntitiesMessage:{required:!1,tsType:{name:"union",raw:"ReactNode | undefined",elements:[{name:"ReactNode"},{name:"undefined"}]},description:""},groupByKind:{required:!1,tsType:{name:"boolean"},description:""}}};export{W as Content};
