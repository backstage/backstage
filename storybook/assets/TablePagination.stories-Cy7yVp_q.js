import{T as P}from"./TablePagination-Ho3GeuLu.js";import"./iframe-BZbCHoUM.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BtTsKq3m.js";import"./useObjectRef-FeXUk1rj.js";import"./Select-2qujmyrD.js";import"./Dialog-93stkdky.js";import"./Button-BO5hAs7f.js";import"./utils-CfGZ4Clr.js";import"./Label-CwnVjHYj.js";import"./Hidden-DEC4QRIi.js";import"./useNumberFormatter-BSOGOm9v.js";import"./context-Binh1Hb9.js";import"./useFocusable-DMHJR1Ta.js";import"./openLink-DkamvTea.js";import"./useLabel-BQGxIH3x.js";import"./useLabels-6Oae5x4h.js";import"./useButton-CjOAcXK_.js";import"./usePress-CX5VBNce.js";import"./textSelection-D1bI-xuP.js";import"./useFocusRing-CMSP-eLx.js";import"./RSPContexts-CQVxt2S3.js";import"./OverlayArrow-DLeedSyG.js";import"./useControlledState-_Te7eGF7.js";import"./SelectionManager-BlWR_tcl.js";import"./useEvent-CsVv3YvT.js";import"./SelectionIndicator-BBNLkP1K.js";import"./Separator-DurFeesT.js";import"./Text-CsQJ0nka.js";import"./useLocalizedStringFormatter-B-68ChVz.js";import"./animation-q4YgknDg.js";import"./VisuallyHidden-B7i-zuNG.js";import"./FieldError-Z5lKC_c2.js";import"./Form-C0o4Wn_y.js";import"./ListBox-CoONP0uy.js";import"./useListState-BJxHwcbF.js";import"./useField-1di9YIwZ.js";import"./useFormReset-B9RadbxB.js";import"./definition-BjBhDJQ8.js";import"./Autocomplete-C9FvD_89.js";import"./Input-ahUdMgyR.js";import"./SearchField-BZCyNE88.js";import"./useFilter-DgtG9Zy0.js";import"./FieldLabel-CLWBdV4O.js";import"./FieldError-STEeTtMw.js";import"./Text-OVzeVJp8.js";import"./ButtonIcon-CjAUSuem.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
