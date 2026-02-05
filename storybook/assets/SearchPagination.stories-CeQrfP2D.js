import{r as d,j as r,F as v,U as R}from"./iframe-M9O-K8SB.js";import{s as _,M as N}from"./api-JIjLndcE.js";import{s as $}from"./translation-kn3hcwTy.js";import{u as j,S as k}from"./SearchContext-3Ne9i5li.js";import{T as q}from"./TablePagination-9Rh2Il-2.js";import{S as b}from"./Grid-DxciBpqo.js";import"./preload-helper-PPVm8Dsz.js";import"./lodash-Czox7iJy.js";import"./useAsync-CFnaQwpM.js";import"./useMountedState-CLl1ZXx0.js";import"./useAnalytics-8ya555GT.js";import"./KeyboardArrowRight-O5ZDR88r.js";import"./MenuItem-Df6QXV-k.js";import"./ListItem-CccU-wMK.js";import"./ListContext-CQy2fJuy.js";import"./TableCell-Cs17tv5t.js";import"./Select-ByRkfEZ7.js";import"./index-B9sM2jn7.js";import"./Popover-9y8CeMZr.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./List-DFXlWgcm.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnxnhVyN.js";const O=e=>Buffer.from(e.toString(),"utf-8").toString("base64"),D=e=>e?Number(Buffer.from(e,"base64").toString("utf-8")):0,C=e=>{const{t:s}=v($),{total:i=-1,cursor:p,hasNextPage:m,onCursorChange:l,limit:h=25,limitLabel:f=s("searchPagination.limitLabel"),limitText:x=({from:g,to:c})=>i>0?s("searchPagination.limitText",{num:`${i}`}):`${g}-${c}`,limitOptions:S,onLimitChange:P,...y}=e,L=d.useMemo(()=>D(p),[p]),T=d.useCallback((g,c)=>{l?.(O(c))},[l]),w=d.useCallback(g=>{const c=g.target.value;P?.(parseInt(c,10))},[P]);return r.jsx(q,{...y,component:"div",count:i,page:L,nextIconButtonProps:{...m!==void 0&&{disabled:!m}},onPageChange:T,rowsPerPage:h,labelRowsPerPage:f,labelDisplayedRows:x,rowsPerPageOptions:S,onRowsPerPageChange:w})},u=e=>{const{pageLimit:s,setPageLimit:i,pageCursor:p,setPageCursor:m,fetchNextPage:l}=j(),h=d.useCallback(f=>{i(f),m(void 0)},[i,m]);return r.jsx(C,{...e,hasNextPage:!!l,limit:s,onLimitChange:h,cursor:p,onCursorChange:m})};C.__docgenInfo={description:`A component with controls for search results pagination.
@param props - See {@link SearchPaginationBaseProps}.
@public`,methods:[],displayName:"SearchPaginationBase",props:{className:{required:!1,tsType:{name:"string"},description:"The component class name."},total:{required:!1,tsType:{name:"number"},description:`The total number of results.
For an unknown number of items, provide -1.
Defaults to -1.`},cursor:{required:!1,tsType:{name:"string"},description:"The cursor for the current page."},hasNextPage:{required:!1,tsType:{name:"boolean"},description:"Whether a next page exists"},onCursorChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(pageCursor: string) => void",signature:{arguments:[{type:{name:"string"},name:"pageCursor"}],return:{name:"void"}}},description:"Callback fired when the current page cursor is changed."},limit:{required:!1,tsType:{name:"number"},description:`The limit of results per page.
Set -1 to display all the results.`},limitLabel:{required:!1,tsType:{name:"ReactNode"},description:`Customize the results per page label.
Defaults to "Results per page:".`},limitText:{required:!1,tsType:{name:"signature",type:"function",raw:`(params: {
  from: number;
  to: number;
  page: number;
  count: number;
}) => ReactNode`,signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  from: number;
  to: number;
  page: number;
  count: number;
}`,signature:{properties:[{key:"from",value:{name:"number",required:!0}},{key:"to",value:{name:"number",required:!0}},{key:"page",value:{name:"number",required:!0}},{key:"count",value:{name:"number",required:!0}}]}},name:"params"}],return:{name:"ReactNode"}}},description:'Customize the results per page text.\nDefaults to "(\\{ from, to, count \\}) =\\> count \\> 0 ? `of $\\{count\\}` : `$\\{from\\}-$\\{to\\}`".'},limitOptions:{required:!1,tsType:{name:"Array",elements:[{name:"unknown"}],raw:"SearchPaginationLimitOption[]"},description:`Options for setting how many results show per page.
If less than two options are available, no select field will be displayed.
Use -1 for the value with a custom label to show all the results.
Defaults to [10, 25, 50, 100].`},onLimitChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => void",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"void"}}},description:"Callback fired when the number of results per page is changed."}}};u.__docgenInfo={description:`A component for setting the search context page limit and cursor.
@param props - See {@link SearchPaginationProps}.
@public`,methods:[],displayName:"SearchPagination"};const se={title:"Plugins/Search/SearchPagination",component:u,decorators:[e=>r.jsx(R,{apis:[[_,new N]],children:r.jsx(k,{children:r.jsx(b,{container:!0,direction:"row",children:r.jsx(b,{item:!0,xs:12,children:r.jsx(e,{})})})})})],tags:["!manifest"]},t=()=>r.jsx(u,{}),a=()=>r.jsx(u,{limitLabel:"Rows per page:"}),o=()=>r.jsx(u,{limitText:({from:e,to:s})=>`${e}-${s} of more than ${s}`}),n=()=>r.jsx(u,{limitOptions:[5,10,20]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"CustomPageLimitLabel"};o.__docgenInfo={description:"",methods:[],displayName:"CustomPageLimitText"};n.__docgenInfo={description:"",methods:[],displayName:"CustomPageLimitOptions"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Default = () => {
  return <SearchPagination />;
};
`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const CustomPageLimitLabel = () => {
  return <SearchPagination limitLabel="Rows per page:" />;
};
`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const CustomPageLimitText = () => {
  return (
    <SearchPagination
      limitText={({ from, to }) => \`\${from}-\${to} of more than \${to}\`}
    />
  );
};
`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const CustomPageLimitOptions = () => {
  return <SearchPagination limitOptions={[5, 10, 20]} />;
};
`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <SearchPagination />;
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchPagination limitLabel="Rows per page:" />;
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"() => {\n  return <SearchPagination limitText={({\n    from,\n    to\n  }) => `${from}-${to} of more than ${to}`} />;\n}",...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchPagination limitOptions={[5, 10, 20]} />;
}`,...n.parameters?.docs?.source}}};const ie=["Default","CustomPageLimitLabel","CustomPageLimitText","CustomPageLimitOptions"];export{a as CustomPageLimitLabel,n as CustomPageLimitOptions,o as CustomPageLimitText,t as Default,ie as __namedExportsOrder,se as default};
