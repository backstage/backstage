import{T as P}from"./TablePagination-B_eBmSmp.js";import"./iframe-BLrGTSaW.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-ZSOSKmjG.js";import"./index-Csl_cXug.js";import"./Select-CFdG8r_i.js";import"./BUIRoutingProvider-DBWr1Axe.js";import"./useFocusRing-BB9hpzXx.js";import"./Button-DRJWcbqL.js";import"./utils-DY5RBqiV.js";import"./Label-CubIRV2P.js";import"./Hidden-mL7bCk3G.js";import"./useLabel-CLI3Xr7r.js";import"./useLabels-CSSt0rmf.js";import"./number-y3IrGTZu.js";import"./I18nProvider-q6Gkr_5S.js";import"./useButton-DzeSStJg.js";import"./usePress-DBe51dZ5.js";import"./textSelection-DRK0jW1V.js";import"./getMetaValue-CAHBYg8p.js";import"./useHover-SA74TXF1.js";import"./FieldError-4Ao0Q7ll.js";import"./Text-BojrXTqg.js";import"./Form-CUwMEZbK.js";import"./useFormValidation-DKsM2ztO.js";import"./ListBox-CfCrhkUW.js";import"./useCollection-D37zMv_s.js";import"./keyboard-D3SBllk2.js";import"./FocusScope-C-33xK2Z.js";import"./useEvent-C0Msdpds.js";import"./useControlledState-DB6Fhmvl.js";import"./useLoadMoreSentinel-zi8f4IaM.js";import"./Autocomplete-HxKAEOXF.js";import"./useLocalizedStringFormatter-DQdAryoN.js";import"./SelectionIndicator-P55eaM0I.js";import"./useListState-9pEU39WA.js";import"./Dialog-PPsdl47e.js";import"./Heading-Dk8FWKf-.js";import"./useOverlayTriggerState-BbSgKNtq.js";import"./VisuallyHidden-Da6yBUmy.js";import"./animation-BTuqI_dB.js";import"./useField-BDehp1MI.js";import"./useFormReset-Dw6LrR2q.js";import"./Input-Cwi8rIcD.js";import"./SearchField-CG8SQMGH.js";import"./useTextField-ByHjNULi.js";import"./useFilter-BVf2WfPH.js";import"./useCollectionAdapter-BwsQ_fCt.js";import"./Avatar-D-i9edD4.js";import"./Skeleton-CLWF7fRd.js";import"./FieldLabel-BTnYHa4F.js";import"./FieldError-BklSVPo8.js";import"./Popover-CvLOCkSt.js";import"./Text-D5gP-IGT.js";import"./ButtonIcon-KOwfGuV9.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
