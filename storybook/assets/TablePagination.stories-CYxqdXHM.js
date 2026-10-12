import{T as P}from"./TablePagination-umVaVTrL.js";import"./iframe-D5t0zV2Z.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-kGsiECgS.js";import"./index-DvEtjejY.js";import"./Select-CrvxggyE.js";import"./Button-DnnkrgV8.js";import"./utils-C39--9xx.js";import"./Label-DaItaSZn.js";import"./Hidden-Dsa08sWj.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./useLabel-32i4SIb0.js";import"./useLabels-D8GfqFut.js";import"./number-DtQkEWx4.js";import"./I18nProvider-CnCaeKRg.js";import"./useButton-DdkvoT6L.js";import"./usePress-Dmt7pnzP.js";import"./textSelection-FMDS3d8l.js";import"./getMetaValue-lPtVOvv4.js";import"./useHover-CMgWw-jG.js";import"./FieldError-BufNcm74.js";import"./Text--erJL1eo.js";import"./Form-RnyeY1Wv.js";import"./useFormValidation-DF0-wOxW.js";import"./ListBox-DuO79u2v.js";import"./useCollection-D9Ya-DMs.js";import"./keyboard-vsvxufhh.js";import"./FocusScope-B3AKJWwl.js";import"./useEvent-Ky4nwph9.js";import"./useControlledState-CWsOmoBN.js";import"./useLoadMoreSentinel-D0yXM04e.js";import"./Autocomplete-C2BxSGXK.js";import"./useLocalizedStringFormatter-Dq7SKV2-.js";import"./SelectionIndicator-CvD_mVQX.js";import"./useListState-CSvV5XS2.js";import"./Dialog-WOQVM2qV.js";import"./Heading-WJeSrVAJ.js";import"./useOverlayTriggerState-D9dRXQwO.js";import"./VisuallyHidden-CfB2zf9t.js";import"./animation-COaRnszU.js";import"./useField-B9NwoH1a.js";import"./useFormReset-B281acCK.js";import"./Input-B8KQxdZr.js";import"./SearchField-DGh4rKVQ.js";import"./useTextField-BqFVkvRL.js";import"./useFilter-YxJTrxQ1.js";import"./useCollectionAdapter-CoD4Pe0W.js";import"./Avatar-DJr0TPXl.js";import"./Skeleton-ByPHpTT3.js";import"./FieldLabel-Cw1GZHoI.js";import"./FieldError-DH87wofE.js";import"./Popover-CahxhAAg.js";import"./Text-DICziNDH.js";import"./ButtonIcon-B0ovJWIw.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
