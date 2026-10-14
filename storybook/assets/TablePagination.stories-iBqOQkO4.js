import{T as P}from"./TablePagination-n2p4h1T6.js";import"./iframe-BboAvpku.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BBnfzFd-.js";import"./index-CsJ4-CBU.js";import"./Select-Cc2D8sE5.js";import"./Button-lIgsiol8.js";import"./utils-RjN6cOlV.js";import"./Label-CSCfT4hg.js";import"./Hidden-B9xv55fQ.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./useLabel-BJaNI2Tj.js";import"./useLabels-C3K2MhXi.js";import"./number-2cz8Gb4T.js";import"./I18nProvider-XE_7i8YB.js";import"./useButton-Cy5D_Qbf.js";import"./usePress-DjSnnouJ.js";import"./textSelection-CDb6_zJX.js";import"./getMetaValue-Dkox27la.js";import"./useHover-Cg57FJ61.js";import"./FieldError-BP_cnqYJ.js";import"./Text-sLtLFVg2.js";import"./Form-D3ZC0YgV.js";import"./useFormValidation-CpFVQ1y7.js";import"./ListBox-sDiOukpB.js";import"./useCollection-DOTSVmf0.js";import"./keyboard-BM3A22Pr.js";import"./FocusScope-DLqV_vIF.js";import"./useEvent-SPsT6SeD.js";import"./useControlledState-DOt2_KtG.js";import"./useLoadMoreSentinel-BTIDvwXh.js";import"./Autocomplete-BCDxmfrb.js";import"./useLocalizedStringFormatter-DAXqnvE_.js";import"./SelectionIndicator-UkpCWI-H.js";import"./useListState-Mwbej2Ks.js";import"./Dialog-B9iODim2.js";import"./Heading-C6khwK_V.js";import"./useOverlayTriggerState-Bs6TYJ4q.js";import"./VisuallyHidden-myxmTh9b.js";import"./animation-8A7n9uPm.js";import"./useField-CNx3ldnW.js";import"./useFormReset-D33UvyuP.js";import"./Input-AtSeLTwI.js";import"./SearchField-vONH4wm1.js";import"./useTextField-BJifqkQ_.js";import"./useFilter-DbXnACEx.js";import"./useCollectionAdapter-BIo69t9f.js";import"./Avatar-13fgQvVK.js";import"./Skeleton-Dj7GLicx.js";import"./FieldLabel-0cuqdPLL.js";import"./FieldError-DuYOBgJ-.js";import"./Popover-DxlCMonk.js";import"./Text-zWPJam2T.js";import"./ButtonIcon-WVia_wbC.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
