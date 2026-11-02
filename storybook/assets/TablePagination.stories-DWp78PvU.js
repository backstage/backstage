import{T as P}from"./TablePagination-C62nEPrB.js";import"./iframe-DvObL_em.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DwzLjeGu.js";import"./index-D2Zpwq-Q.js";import"./Select-BJKQgcXi.js";import"./Button-BnuV3xvc.js";import"./utils-BE29XZkF.js";import"./Label-DVU8J7bE.js";import"./Hidden-9nwWkQxZ.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./useLabel-Dnkr3wg9.js";import"./useLabels-B4Qm2p4e.js";import"./number-Brjj_L0c.js";import"./I18nProvider-D9Ed_WqX.js";import"./useButton-1rnyv_zw.js";import"./usePress-YbeHGM9M.js";import"./textSelection-C86JgNxW.js";import"./getMetaValue-aV81Iu2D.js";import"./useHover-BBinV-uq.js";import"./FieldError-CKCHKSwJ.js";import"./Text-DMNz7_bC.js";import"./Form-uDPxvokJ.js";import"./useFormValidation-B7os7M_X.js";import"./ListBox-CW9CuJgQ.js";import"./useCollection-BWKe6rLa.js";import"./keyboard-yu4clHGi.js";import"./FocusScope-Ctd5mj0p.js";import"./useEvent-PRo-pXvf.js";import"./useControlledState-DTrBQisE.js";import"./useLoadMoreSentinel-CpqtxRDN.js";import"./Autocomplete-BfbdjnJY.js";import"./useLocalizedStringFormatter-CTxy863n.js";import"./SelectionIndicator-CfHHXdGx.js";import"./useListState-rF97ez7_.js";import"./Dialog-CDF8Z2PM.js";import"./Heading-DTDycEJw.js";import"./useOverlayTriggerState-DTpXlUK_.js";import"./VisuallyHidden-D7cx75l9.js";import"./animation-PoAPtwJr.js";import"./useField-XkonZFVV.js";import"./useFormReset-BXzPmcpf.js";import"./Input-CDWq18l5.js";import"./SearchField-DABK_L77.js";import"./useTextField-B17J0BpL.js";import"./useFilter-BK4WEGdM.js";import"./useCollectionAdapter-JwcM6Xot.js";import"./Avatar-Ccap3so6.js";import"./Skeleton-B3jyunQg.js";import"./FieldLabel-Bdw1ZckT.js";import"./FieldError-l6uEQuJ4.js";import"./Popover-C4pa1mrO.js";import"./Text-BaU24DSn.js";import"./ButtonIcon-CxBdcPMM.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
