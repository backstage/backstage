import{T as P}from"./TablePagination-BwrpcHkP.js";import"./iframe-BErNvpjr.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BTVJqnIZ.js";import"./index-9xGCRmTA.js";import"./Select-BiQJFWJI.js";import"./Button-ZmGKrZ8S.js";import"./utils-CkI-fiaI.js";import"./Label-CdvKSS9p.js";import"./Hidden-BXpNp4mY.js";import"./useFocusRing-DhH0pnm8.js";import"./openLink-VEX9Ze2_.js";import"./useLabel-0LCDbxSL.js";import"./useLabels-BfB1Y_Ok.js";import"./number-B7KdHmdZ.js";import"./I18nProvider-Co2RDX0c.js";import"./useButton-CuzCCNla.js";import"./usePress-BuVIReZf.js";import"./textSelection-Beclu5dQ.js";import"./useHover-n_zdByGl.js";import"./FieldError-B0J3oIAj.js";import"./Text-m3plxjD3.js";import"./useFormValidation-CVK9l0hq.js";import"./ListBox-DtpahCWk.js";import"./useCollection-Dnxe7Oy8.js";import"./keyboard-ZpJRXcMx.js";import"./FocusScope-CTGfV_ax.js";import"./useEvent-lGzlaYoH.js";import"./useControlledState-DHvityQM.js";import"./getItemCount-B3MHdml6.js";import"./Autocomplete-wiZIjKv7.js";import"./useLocalizedStringFormatter-zvzfXQUD.js";import"./useListState-Ci7FWIUB.js";import"./Dialog-BiSqxIuw.js";import"./Heading-HRif4aHN.js";import"./useOverlayTriggerState-dtDxw6VN.js";import"./VisuallyHidden-Db_hi_Bl.js";import"./animation-vcnj4bnB.js";import"./useField-DXkN9cJL.js";import"./useFormReset-1WyntnJY.js";import"./Input-BVdpaGN9.js";import"./SearchField-XOxAVTba.js";import"./useTextField-D2kqKQ27.js";import"./useFilter-BFesSPZp.js";import"./useCollectionAdapter-DhsF5TwT.js";import"./Avatar-B60driEr.js";import"./Skeleton-JSe5J4Ra.js";import"./FieldLabel-XRGvsQ9v.js";import"./FieldError-CMLOHIaR.js";import"./Popover-DQHJcFIm.js";import"./Text-DdtiTKlO.js";import"./ButtonIcon-DzHq31Aa.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
