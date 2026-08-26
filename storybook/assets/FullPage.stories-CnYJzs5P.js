import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-Zd-YI-2K.js";import{P as l}from"./PluginHeader-CqF-Gpox.js";import{C as p}from"./Container-1fSfyCMn.js";import{T as t}from"./Text-CFiK0v-x.js";import{B as j}from"./BUIProvider-4zqAwNHJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CirsuCpW.js";import"./utils-B9HGNt0C.js";import"./useObjectRef-CSGev21E.js";import"./useCollection-56kX9o5o.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./Hidden-5-RKz3aG.js";import"./keyboard-D9WPU0OD.js";import"./FocusScope-D-eoOKQj.js";import"./useEvent-Bvwyi-gT.js";import"./I18nProvider-BhAOc9Ga.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./useControlledState-DInYdsj6.js";import"./Link-C5glur47.js";import"./useLink-DriAbYNv.js";import"./useHover-BUmLyoKK.js";import"./useLocalizedStringFormatter-1rTSaIVc.js";import"./Button-BPK5A0ph.js";import"./Label-YhzAN0Eo.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./number-DiAqIE8i.js";import"./useButton-BzU-QnhQ.js";import"./Menu-BiINBgIh.js";import"./Autocomplete-DTC98uk5.js";import"./getItemCount-DPCKm2BS.js";import"./Input-DNefN7x7.js";import"./ListBox-CwRQCJrJ.js";import"./Text-BJ1H8aMC.js";import"./useListState-Ba_x5rtm.js";import"./Dialog-6paZnkzR.js";import"./Heading-BJB_7RPS.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./VisuallyHidden-Do0nVhed.js";import"./animation-BuTCjKPk.js";import"./SearchField-DHbszZZe.js";import"./FieldError-5PqzcpId.js";import"./useFormValidation-DCAqIXhc.js";import"./useTextField-BK-HcGoi.js";import"./useField-Cx2viaGD.js";import"./useFormReset-CiFp_S2j.js";import"./Virtualizer-BDEY7Q3f.js";import"./useFilter-B360iIVa.js";import"./getNodeText-Cl4qhgiQ.js";import"./Link-Bi3ecWei.js";import"./useResolvedHref-DdfPjt6A.js";import"./Tooltip-CfbQy97v.js";import"./VisuallyHidden-BHUevxsB.js";import"./Tabs-CAL5VMyv.js";import"./useHasTabbableChild-EPF6yVuS.js";import"./BUIRoutingProvider-C6YoxI9h.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
