import{T as P}from"./TablePagination-PTvFQgOX.js";import"./iframe-a5iorYt_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DomNprMl.js";import"./index-DmAgGD7M.js";import"./Select-D91BK1EX.js";import"./BUIRoutingProvider-B91F5UQb.js";import"./useFocusRing-BW-GobYG.js";import"./Button-DH0afYUU.js";import"./utils-CKuAz2Wi.js";import"./Label-Orfe5toA.js";import"./Hidden-Bu-9bwhW.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./number-Ccp2yLIm.js";import"./I18nProvider-Cha0UYwj.js";import"./useButton-6YfvAB0s.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./getMetaValue-BDmRRgum.js";import"./useHover-D7-ycX7p.js";import"./FieldError-BwiCreHd.js";import"./Text-BzXkZD1r.js";import"./Form-9OpxVQln.js";import"./useFormValidation-S2CY6qm2.js";import"./ListBox-3Ml5ELOg.js";import"./useCollection-BBpc6g4m.js";import"./keyboard-D4TVu98T.js";import"./FocusScope-RWMZe2T0.js";import"./useEvent-CWwVnFif.js";import"./useControlledState-x1Vpl6eH.js";import"./useLoadMoreSentinel-CoFFNPV0.js";import"./Autocomplete-C-CgF1zY.js";import"./useLocalizedStringFormatter-CEuruQsY.js";import"./SelectionIndicator-zgWFy5d3.js";import"./useListState-2CE38nHg.js";import"./Dialog-BAw8KcVJ.js";import"./Heading-BX-j4_Ff.js";import"./useOverlayTriggerState-oc_4bf5x.js";import"./VisuallyHidden-Bfh8sdi2.js";import"./animation-CocdaLDQ.js";import"./useField-DZ_E8vUK.js";import"./useFormReset-CbHbRAHO.js";import"./Input-CaBktYIq.js";import"./SearchField-nz3tdmNL.js";import"./useTextField-BDxLzRUI.js";import"./useFilter-Cfq7ZC3o.js";import"./useCollectionAdapter-o6Pzx9yh.js";import"./Avatar-LCnSB_FC.js";import"./Skeleton-B2OfzBCV.js";import"./FieldLabel-1nmMQZtO.js";import"./FieldError-DTLXiL5V.js";import"./Popover-WFYWmGRr.js";import"./Text-C9wqzkPi.js";import"./ButtonIcon-CXYdBlUn.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
