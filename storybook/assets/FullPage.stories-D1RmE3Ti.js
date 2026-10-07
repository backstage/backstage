import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-WUTgIN9N.js";import{P as l}from"./PluginHeader-MOwj0LwW.js";import{C as p}from"./Container-D1Lwmq9k.js";import{T as t}from"./Text-pv5oC1mf.js";import{B as j}from"./BUIProvider-WuPWvIl5.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BmfM_P7U.js";import"./utils-e_ANvV3R.js";import"./useObjectRef-CHIArbS8.js";import"./useCollection-DwBHBcpG.js";import"./useFocusRing-BzNQUgBS.js";import"./openLink-C4ChH1Hb.js";import"./Hidden-cqxb7NEw.js";import"./keyboard-JM-SeqEU.js";import"./FocusScope-opzwpQwp.js";import"./useEvent-CKbgSJqF.js";import"./I18nProvider-DmKJ1bjB.js";import"./usePress-BuMIReV1.js";import"./textSelection-DRp-kAWi.js";import"./useControlledState-CP3bPIEi.js";import"./Link-492deS0N.js";import"./useLink-HNAP60Xu.js";import"./useHover-BXi1yiSF.js";import"./useLocalizedStringFormatter-tjpZHflc.js";import"./Button-uNEF8Zyb.js";import"./Label-DYgvNgnu.js";import"./useLabel-BntByxux.js";import"./useLabels-DVXgHCjp.js";import"./number-QltqjbkG.js";import"./useButton-D7XqHIUl.js";import"./Menu-BIZD0T3d.js";import"./Autocomplete-Dh0vErH3.js";import"./getItemCount-BDATx2kJ.js";import"./Input-BGT2LOKH.js";import"./ListBox-B5ORWm7z.js";import"./Text-C5GiuN3F.js";import"./useListState-CGXQQQJG.js";import"./Dialog-DLURENg7.js";import"./Heading-BM2NxjtA.js";import"./useOverlayTriggerState-Cw8HJspH.js";import"./VisuallyHidden-BIpmfli2.js";import"./animation-gc98-Tq1.js";import"./SearchField-BoMjv0ng.js";import"./FieldError-D-4pHLHL.js";import"./useFormValidation-D2qGqtVn.js";import"./useTextField-CnER0ozT.js";import"./useField-CM7_SpaW.js";import"./useFormReset-BwnM2z0H.js";import"./Virtualizer-N5W965Dt.js";import"./useFilter-CKnKZ3wo.js";import"./getNodeText-D9wvAfW7.js";import"./Link-BZ5NYAZL.js";import"./useResolvedHref--v0iYvrv.js";import"./Tooltip-1KTus1LO.js";import"./VisuallyHidden-BSzST3cm.js";import"./Tabs-CXkGiB9o.js";import"./useHasTabbableChild-Cpqvrw52.js";import"./BUIRoutingProvider-CNPvymuD.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
