import{j as u}from"./jsx-runtime-Cw0GR0a5.js";import{m as k}from"./makeStyles-CRB_T0k9.js";import{B as b}from"./Box-DU2WS7ls.js";import{T}from"./Tooltip-cpLPvOyY.js";import{r as y}from"./index-CTjT7uj6.js";import{c as q,d as A}from"./ApiRef-CqkoWjZn.js";import{g as c}from"./appWrappers-DGD7X2ct.js";import{s as w,D as g}from"./ref-8pKZtiZi.js";const j=q({id:"plugin.catalog.entity-presentation"});function x(e,n){const{kind:i,namespace:r,name:s,title:t,description:a,displayName:d,type:p}=E(e),l=w({kind:i||"unknown",namespace:r||g,name:s||"unknown"}),o=L({kind:i,namespace:r,name:s,context:n}),m=[d,t,o].find(f=>f&&typeof f=="string"),v=[m!==l?l:void 0,p,a].filter(f=>f&&typeof f=="string").join(" | ");return{entityRef:l,primaryTitle:m,secondaryTitle:v||void 0,Icon:void 0}}const h=e=>!!e&&typeof e=="string";function E(e){if(typeof e=="string"){let n=e.indexOf(":");const i=e.indexOf("/");i!==-1&&i<n&&(n=-1);const r=n===-1?void 0:e.slice(0,n),s=i===-1?void 0:e.slice(n+1,i),t=e.slice(Math.max(n+1,i+1));return{kind:r,namespace:s,name:t}}if(typeof e=="object"&&e!==null){const n=[c(e,"kind")].find(h),i=[c(e,"metadata.namespace"),c(e,"namespace")].find(h),r=[c(e,"metadata.name"),c(e,"name")].find(h),s=[c(e,"metadata.title")].find(h),t=[c(e,"metadata.description")].find(h),a=[c(e,"spec.profile.displayName")].find(h),d=[c(e,"spec.type")].find(h);return{kind:n,namespace:i,name:r,title:s,description:t,displayName:a,type:d}}return{}}function L(e){var d,p,l,o,m;const n=((d=e.kind)==null?void 0:d.toLocaleLowerCase("en-US"))||"unknown",i=e.namespace||g,r=e.name||"unknown",s=(l=(p=e.context)==null?void 0:p.defaultKind)==null?void 0:l.toLocaleLowerCase("en-US"),t=(m=(o=e.context)==null?void 0:o.defaultNamespace)==null?void 0:m.toLocaleLowerCase("en-US");let a=r;return(t&&i.toLocaleLowerCase("en-US")!==t||i!==g)&&(a=`${i}/${a}`),s&&n.toLocaleLowerCase("en-US")!==s&&(a=`${n}:${a}`),a}function N(e,n,i){const[r,s]=y.useState(e);return y.useEffect(()=>{s(e);const t=n==null?void 0:n.subscribe({next:a=>{s(a)},complete:()=>{t==null||t.unsubscribe()}});return()=>{t==null||t.unsubscribe()}},i),r}function I(e,n){const r=A().get(j),s=[r,JSON.stringify(e),JSON.stringify(n||null)],t=y.useMemo(()=>{if(!r){const a=x(e,n);return{snapshot:a,promise:Promise.resolve(a)}}return r.forEntity(typeof e=="string"||"metadata"in e?e:w(e),n)},s);return N(t.snapshot,t.update$,[t])}const J=k(e=>({root:{display:"inline-flex",alignItems:"center",textDecoration:"inherit"},icon:{marginRight:e.spacing(.5),color:e.palette.text.secondary,"& svg":{verticalAlign:"middle"}}}),{name:"CatalogReactEntityDisplayName"}),S=e=>{const{entityRef:n,hideIcon:i,disableTooltip:r,defaultKind:s,defaultNamespace:t}=e,a=J(),{primaryTitle:d,secondaryTitle:p,Icon:l}=I(n,{defaultKind:s,defaultNamespace:t});let o=u.jsx(u.Fragment,{children:d});return o=u.jsxs(b,{component:"span",className:a.root,children:[l&&!i?u.jsx(b,{component:"span",className:a.icon,children:u.jsx(l,{fontSize:"inherit"})}):null,o]}),p&&!r&&(o=u.jsx(T,{enterDelay:1500,title:p,children:o})),o};S.__docgenInfo={description:`Shows a nice representation of a reference to an entity.

@public`,methods:[],displayName:"EntityDisplayName",props:{entityRef:{required:!0,tsType:{name:"union",raw:"Entity | CompoundEntityRef | string",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},{name:"signature",type:"object",raw:`{
  kind: string;
  namespace: string;
  name: string;
}`,signature:{properties:[{key:"kind",value:{name:"string",required:!0}},{key:"namespace",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}},{name:"string"}]},description:""},hideIcon:{required:!1,tsType:{name:"boolean"},description:""},disableTooltip:{required:!1,tsType:{name:"boolean"},description:""},defaultKind:{required:!1,tsType:{name:"string"},description:""},defaultNamespace:{required:!1,tsType:{name:"string"},description:""}}};export{S as E};
