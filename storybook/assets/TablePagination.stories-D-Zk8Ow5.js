import{T as P}from"./TablePagination-sc1-CLcA.js";import"./iframe-Pg_F-I9L.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CSrWawO4.js";import"./useObjectRef-HykmMk-o.js";import"./Select-B3nb1Hwa.js";import"./Dialog-D2iow-a9.js";import"./Button-D4FhjViO.js";import"./utils-qMO_rWJq.js";import"./Label-3zKuDuDQ.js";import"./Hidden-Ys7ZlpFD.js";import"./useNumberFormatter-Cuizy-2S.js";import"./context-DiEr_iNn.js";import"./useFocusable-tELC1w7o.js";import"./openLink-CHCvyqBl.js";import"./useLabel-Cv3Ke033.js";import"./useLabels-CfZuGdDh.js";import"./useButton-Cd7mVcz4.js";import"./usePress-D9RcbHE0.js";import"./textSelection-p-bbU3FQ.js";import"./useFocusRing-CTLDmw4r.js";import"./RSPContexts-CP7vpgdH.js";import"./OverlayArrow-BVZSlvOl.js";import"./useControlledState-CJUYhagC.js";import"./SelectionManager-wVy5pdP7.js";import"./useEvent-Ie90aWnc.js";import"./SelectionIndicator-BsjX55GR.js";import"./Separator-2guFG7g-.js";import"./Text-llDYcWgc.js";import"./useLocalizedStringFormatter-s8xubs7w.js";import"./animation-yYjl9c-H.js";import"./VisuallyHidden-Lu2_ql2A.js";import"./FieldError-Ci19Uhdz.js";import"./Form-CeMUfUJs.js";import"./ListBox-BJbTwm_8.js";import"./useListState-Csz_vsZA.js";import"./useField-Bk4bOBfV.js";import"./useFormReset-pX1J00j9.js";import"./definition-DYItoovE.js";import"./Autocomplete-X6susHtK.js";import"./Input-q6KMR1kV.js";import"./SearchField-WKyxM0ma.js";import"./useFilter-UDt6kk6K.js";import"./FieldLabel-BipWcz95.js";import"./FieldError-BKb0zOvU.js";import"./Text-DGtaFSAT.js";import"./ButtonIcon-CuekJ3ce.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ge=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ge as __namedExportsOrder,pe as default};
