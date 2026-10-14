import{T as P}from"./TablePagination-Cp8siyhV.js";import"./iframe-osqb7I7f.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BZCAlVk9.js";import"./index-DwIBA9cq.js";import"./Select-BmmxxFWG.js";import"./Button-BIQxkz6R.js";import"./utils-C6BeXBHQ.js";import"./Label-Dc6bt0j8.js";import"./Hidden-BoP2pNUM.js";import"./useFocusRing-CQWExipe.js";import"./openLink-Dy9KSOrl.js";import"./useLabel-CwKyruxE.js";import"./useLabels-U9TV3Uv2.js";import"./number-RCfGZXCh.js";import"./I18nProvider-CsDtc1Vo.js";import"./useButton-BK3KpZgP.js";import"./usePress-Dn790MAk.js";import"./textSelection-jaE6bIEi.js";import"./getMetaValue-4uTB8c1-.js";import"./useHover-C6cSG5OI.js";import"./FieldError-s1w9dgOY.js";import"./Text-BtxPcA8W.js";import"./Form-4MSHWhmU.js";import"./useFormValidation-BDG5TrNG.js";import"./ListBox-Bxol7Xe6.js";import"./useCollection-40RUHW7U.js";import"./keyboard-Uhp3bD4I.js";import"./FocusScope-CKCM-yJa.js";import"./useEvent-CE4CgK68.js";import"./useControlledState-DMCdQE-I.js";import"./useLoadMoreSentinel-C8XxAFFz.js";import"./Autocomplete-Cl89j45E.js";import"./useLocalizedStringFormatter-D8oGcEPo.js";import"./SelectionIndicator-DU8v45nn.js";import"./useListState-yOfcTRaq.js";import"./Dialog-CMeLZcWJ.js";import"./Heading-UwJ90HiN.js";import"./useOverlayTriggerState-dYbDbyry.js";import"./VisuallyHidden-DaXqQ9Ff.js";import"./animation-BsqcNdGe.js";import"./useField-D5QoDmxq.js";import"./useFormReset-BLi1GwHW.js";import"./Input-CXF4SC00.js";import"./SearchField-C7ECccKL.js";import"./useTextField-nejwz2I7.js";import"./useFilter-DtlDZTx0.js";import"./useCollectionAdapter-CQSwNYpQ.js";import"./Avatar-DM1LQ-Ci.js";import"./Skeleton-aX74_kil.js";import"./FieldLabel-d8lpZJgj.js";import"./FieldError-DRYDcFsC.js";import"./Popover-DFia3lrR.js";import"./Text-CTlezMwF.js";import"./ButtonIcon-CB0cn2Eb.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
