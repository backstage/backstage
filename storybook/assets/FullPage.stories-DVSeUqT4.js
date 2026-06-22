import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-hQz1Bovf.js";import{P as l}from"./PluginHeader-CUNKU0xR.js";import{C as p}from"./Container-Dte1QseD.js";import{T as t}from"./Text-DdWU9-lb.js";import{B as j}from"./BUIProvider-DrhB4dcF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FWFS6Ht_.js";import"./utils-Pry2iZeD.js";import"./useObjectRef-BZ987qtB.js";import"./useCollection-Cb7abx-d.js";import"./useFocusRing-C3OD7nib.js";import"./openLink-B-dyxHNl.js";import"./Hidden-BqzmQXOc.js";import"./keyboard-he29tEj5.js";import"./FocusScope-CecXE6Ry.js";import"./useEvent--KmV8xmg.js";import"./I18nProvider-a0qIHqSM.js";import"./usePress-CccSWJzt.js";import"./textSelection-Cp_gZcRW.js";import"./useControlledState--W8dIr0F.js";import"./Link-BN6gaqA-.js";import"./useLink-C5SXXt06.js";import"./useHover-DMQGs42H.js";import"./useLocalizedStringFormatter-DjKxePN-.js";import"./Button-Ch3RVnjq.js";import"./Label-B5koVi8k.js";import"./useLabel-BRsF9iG_.js";import"./useLabels-ZBMKhu5T.js";import"./number-B-GEUIkl.js";import"./useButton-DYFFtKSn.js";import"./Menu-DZUk-3m1.js";import"./Autocomplete-BGy9sauS.js";import"./getItemCount-C-khq3P_.js";import"./Input-CW3dRuCG.js";import"./ListBox-wpLVGfiI.js";import"./Text-CECxUU9A.js";import"./useListState-Dyr1nGEJ.js";import"./Dialog-ebcM6ZI2.js";import"./Heading-DCLutLrl.js";import"./useOverlayTriggerState-BrKZac3u.js";import"./VisuallyHidden-BJA4xb02.js";import"./animation-6avlbPLD.js";import"./SearchField-DNoqW-Ap.js";import"./FieldError-BZqCFV-T.js";import"./useFormValidation-gBSJNCGj.js";import"./useTextField-C8_4ZoZz.js";import"./useField-DD1vcu_y.js";import"./useFormReset-BEXxxxDO.js";import"./Virtualizer-BGH9hhl7.js";import"./useFilter-CLUYuBNu.js";import"./getNodeText-28XlPwgF.js";import"./Link-tW2nm41y.js";import"./useResolvedHref-CyacsD8B.js";import"./Tooltip-X1jSV_iz.js";import"./VisuallyHidden-uDMrxaaL.js";import"./Tabs-DLn5RkTl.js";import"./useHasTabbableChild-B6iZxDTB.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
