import{T as P}from"./TablePagination-DjoKq2qp.js";import"./iframe-CC8dZ5v0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DrnumOVC.js";import"./index-D66fjpEe.js";import"./Select-BclLXwSJ.js";import"./Dialog-_Td6pOrN.js";import"./Button-Ccij9kQE.js";import"./utils-BJGNU2UD.js";import"./Label-D8RauFTA.js";import"./Hidden-0OxxBXUx.js";import"./useGlobalListeners-VTBRwdE_.js";import"./openLink-R4xAzZJL.js";import"./useLabel-4Aw-DEns.js";import"./useLabels-Ho-venkv.js";import"./number-DZhvm6eS.js";import"./I18nProvider-CaDEb_MT.js";import"./useButton-DLkEE9sZ.js";import"./usePress-CY9pQlxN.js";import"./textSelection-F9xqT_S-.js";import"./useHover-BJkwObms.js";import"./Heading-B-zQOpWR.js";import"./useOverlayTriggerState-umeLxON0.js";import"./useControlledState-CSasWubL.js";import"./useCollection-D1dXl4eJ.js";import"./keyboard-DOMww9i4.js";import"./FocusScope-GlTV-8Kl.js";import"./useEvent-fTcL2C30.js";import"./Autocomplete-DI_V9cAQ.js";import"./useLocalizedStringFormatter-DJVXrFCw.js";import"./getItemCount-DOk1B_NP.js";import"./Text-DMMjCAFn.js";import"./VisuallyHidden-BcXz6YOD.js";import"./animation-AqT20z9o.js";import"./FieldError-B4SxufUN.js";import"./useFormValidation-sG0q17Pr.js";import"./ListBox-DlFfrCjD.js";import"./useListState-CTDHMg2u.js";import"./useField-KVyKcbSv.js";import"./useFormReset-B6UV1Sqp.js";import"./definition-Bhu033aH.js";import"./Input-Az7S4Dd2.js";import"./SearchField-C7wzWMIR.js";import"./useTextField-ECOxvN2s.js";import"./useFilter-DntafXO8.js";import"./FieldLabel-C7BIx1zu.js";import"./FieldError-DB3fc62x.js";import"./Text-BoR7DgQk.js";import"./ButtonIcon-CKvTHHsj.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
