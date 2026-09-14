import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-C1Du46eF.js";import{P as l}from"./PluginHeader-CH6TCzCX.js";import{C as p}from"./Container-C98B2vC6.js";import{T as t}from"./Text-BU3kVSsj.js";import{B as j}from"./BUIProvider-BsjCr296.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C0MspUWn.js";import"./utils-hkspyz06.js";import"./useObjectRef-DOq-huoO.js";import"./useCollection-CeYnkAnH.js";import"./useFocusRing-C0uj4VUP.js";import"./openLink-CByF1g0c.js";import"./Hidden-BsQwcHXl.js";import"./keyboard-CFktmufy.js";import"./FocusScope-CrWLtl4c.js";import"./useEvent-B0PtjqRu.js";import"./I18nProvider-B27jmHNy.js";import"./usePress-CiBw4CLk.js";import"./textSelection-DIl4JRXM.js";import"./useControlledState-BHe0N0Aq.js";import"./Link-CG7-sxD5.js";import"./useLink-Cs3OhGCZ.js";import"./useHover-CFEPcSqQ.js";import"./useLocalizedStringFormatter-CpQkqVsH.js";import"./Button-kKzp0Xb2.js";import"./Label-CPEk2ZbI.js";import"./useLabel-C8HhkV7I.js";import"./useLabels-CQnXJWhI.js";import"./number-DRYzdm3i.js";import"./useButton-DUAO8AkZ.js";import"./Menu-aakCvpL8.js";import"./Autocomplete-BjwsbRnL.js";import"./getItemCount-CqKXvEF9.js";import"./Input-BWPK4-A8.js";import"./ListBox-CWZ1YyXv.js";import"./Text-DDKqJmZc.js";import"./useListState-CzlqaNAY.js";import"./Dialog-CzTKiC-y.js";import"./Heading-Ca3If9fa.js";import"./useOverlayTriggerState-MXUE1IGe.js";import"./VisuallyHidden-Cg3DRSEG.js";import"./animation-Cp8UTTIv.js";import"./SearchField-BPDn4Goy.js";import"./FieldError-CW_JKSLC.js";import"./useFormValidation-BhsMD-cv.js";import"./useTextField-6Mu4PHW9.js";import"./useField-CN5nphuL.js";import"./useFormReset-D4W7gYuW.js";import"./Virtualizer-Le-ysrba.js";import"./useFilter-BXRhrNJJ.js";import"./getNodeText-SuddOG3B.js";import"./Link-BUN6vEay.js";import"./useResolvedHref-gr1P5MbU.js";import"./Tooltip-CbbOey0w.js";import"./VisuallyHidden-SiHEPg6j.js";import"./Tabs-Dmxw7vrv.js";import"./useHasTabbableChild-4kAWbcyN.js";import"./BUIRoutingProvider-DL2sT8fx.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
