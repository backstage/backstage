import{bu as k,ca as y,cE as T,bR as p}from"./iframe-BT856zKW.js";import{c as q}from"./useAnalytics-DNoiAALH.js";import{b as A}from"./appWrappers-B9ReHvUd.js";import{s as w,D as f}from"./ref-C0VTUPuL.js";import{B as b}from"./Box-DRDGYh8a.js";import{T as j}from"./Tooltip-BQY5eIJW.js";import{m as x}from"./makeStyles-BvvLmOsG.js";const E=q({id:"plugin.catalog.entity-presentation"});var L=A();const o=k(L);function N(e,n){const{kind:t,namespace:r,name:s,title:i,description:a,displayName:h,type:m}=I(e),d=w({kind:t||"unknown",namespace:r||f,name:s||"unknown"}),l=S({kind:t,namespace:r,name:s,context:n}),g=[h,i,l].find(u=>u&&typeof u=="string"),v=[g!==d?d:void 0,m,a].filter(u=>u&&typeof u=="string").join(" | ");return{entityRef:d,primaryTitle:g,secondaryTitle:v||void 0,Icon:void 0}}const c=e=>!!e&&typeof e=="string";function I(e){if(typeof e=="string"){let n=e.indexOf(":");const t=e.indexOf("/");t!==-1&&t<n&&(n=-1);const r=n===-1?void 0:e.slice(0,n),s=t===-1?void 0:e.slice(n+1,t),i=e.slice(Math.max(n+1,t+1));return{kind:r,namespace:s,name:i}}if(typeof e=="object"&&e!==null){const n=[o(e,"kind")].find(c),t=[o(e,"metadata.namespace"),o(e,"namespace")].find(c),r=[o(e,"metadata.name"),o(e,"name")].find(c),s=[o(e,"metadata.title")].find(c),i=[o(e,"metadata.description")].find(c),a=[o(e,"spec.profile.displayName")].find(c),h=[o(e,"spec.type")].find(c);return{kind:n,namespace:t,name:r,title:s,description:i,displayName:a,type:h}}return{}}function S(e){const n=e.kind?.toLocaleLowerCase("en-US")||"unknown",t=e.namespace||f,r=e.name||"unknown",s=e.context?.defaultKind?.toLocaleLowerCase("en-US"),i=e.context?.defaultNamespace?.toLocaleLowerCase("en-US");let a=r;return(i&&t.toLocaleLowerCase("en-US")!==i||t!==f)&&(a=`${t}/${a}`),s&&n.toLocaleLowerCase("en-US")!==s&&(a=`${n}:${a}`),a}function J(e,n,t){const[r,s]=y.useState(e);return y.useEffect(()=>{s(e);const i=n?.subscribe({next:a=>{s(a)},complete:()=>{i?.unsubscribe()}});return()=>{i?.unsubscribe()}},t),r}function D(e,n){const r=T().get(E),s=[r,JSON.stringify(e),JSON.stringify(n||null)],i=y.useMemo(()=>{if(!r){const a=N(e,n);return{snapshot:a,promise:Promise.resolve(a)}}return r.forEntity(typeof e=="string"||"metadata"in e?e:w(e),n)},s);return J(i.snapshot,i.update$,[i])}const P=x(e=>({root:{display:"inline-flex",alignItems:"center",textDecoration:"inherit"},icon:{marginRight:e.spacing(.5),color:e.palette.text.secondary,"& svg":{verticalAlign:"middle"}}}),{name:"CatalogReactEntityDisplayName"}),K=e=>{const{entityRef:n,hideIcon:t,disableTooltip:r,defaultKind:s,defaultNamespace:i}=e,a=P(),{primaryTitle:h,secondaryTitle:m,Icon:d}=D(n,{defaultKind:s,defaultNamespace:i});let l=p.jsx(p.Fragment,{children:h});return l=p.jsxs(b,{component:"span",className:a.root,children:[d&&!t?p.jsx(b,{component:"span",className:a.icon,children:p.jsx(d,{fontSize:"inherit"})}):null,l]}),m&&!r&&(l=p.jsx(j,{enterDelay:1500,title:m,children:l})),l};K.__docgenInfo={description:`Shows a nice representation of a reference to an entity.

@remarks

This component uses the {@link useEntityPresentation} hook internally and
renders the entity's primary title with optional icon and tooltip. It is
the simplest way to display an entity name in JSX.

For more control over the presentation data, use the
{@link useEntityPresentation} hook directly. For non-React contexts, use
{@link entityPresentationSnapshot}.

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
}`,signature:{properties:[{key:"kind",value:{name:"string",required:!0}},{key:"namespace",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}},{name:"string"}]},description:""},hideIcon:{required:!1,tsType:{name:"boolean"},description:""},disableTooltip:{required:!1,tsType:{name:"boolean"},description:""},defaultKind:{required:!1,tsType:{name:"string"},description:""},defaultNamespace:{required:!1,tsType:{name:"string"},description:""}}};export{K as E};
