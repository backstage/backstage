import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-CLUDVQ5J.js";import{P as l}from"./PluginHeader-CVDPoAUJ.js";import{C as p}from"./Container-CA9Xekid.js";import{T as t}from"./Text-BZ_kiMyv.js";import{B as j}from"./BUIProvider-C0zgFkPZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCFrD1rS.js";import"./utils-CdHRLi7C.js";import"./useObjectRef-CQXTcWYX.js";import"./useCollection-RmlFSKrL.js";import"./useFocusRing-Cx5cCMJc.js";import"./openLink-lG-tuZVC.js";import"./Hidden-DkhqOV0y.js";import"./keyboard-CTVKKV84.js";import"./FocusScope-BhVVZnlr.js";import"./useEvent-BvcA7h7K.js";import"./I18nProvider-s5nF7SKo.js";import"./usePress-jgC8cslr.js";import"./textSelection-BVXh5k5C.js";import"./useControlledState-CzVtswPQ.js";import"./Link-DHxbR859.js";import"./useLink-D7eYyZLx.js";import"./useHover-DTy99tks.js";import"./useLocalizedStringFormatter-BScKml51.js";import"./Button-BmqzM9an.js";import"./Label-CNIOxAyj.js";import"./useLabel-CjwBUe0X.js";import"./useLabels-q6j7b-So.js";import"./number-CoCtNFQ5.js";import"./useButton-D_vL7KO0.js";import"./Menu-DcKCV9P3.js";import"./Autocomplete-Dtbkf9kY.js";import"./getItemCount-K3ShNJW4.js";import"./Input-B1aj2MuM.js";import"./ListBox-CUBe8M4g.js";import"./Text-DDdAhRnT.js";import"./useListState-CNd9LeDF.js";import"./Dialog-III0Ly0I.js";import"./Heading-BgKbRHoo.js";import"./useOverlayTriggerState-CQGaE1Jp.js";import"./VisuallyHidden-D4y4EBqD.js";import"./animation-o_HaFoft.js";import"./SearchField-BkCVi9Cs.js";import"./FieldError-DaJxDAqj.js";import"./useFormValidation-CBERPyny.js";import"./useTextField-gz8a5pLp.js";import"./useField-D-2OJaRj.js";import"./useFormReset-H3vuwfeO.js";import"./Virtualizer-BFUHiyl-.js";import"./useFilter-BlwBeS82.js";import"./getNodeText-WvnVy10U.js";import"./Link--JpuyF0B.js";import"./useResolvedHref-BjPkToeD.js";import"./Tooltip-BgYCttf5.js";import"./VisuallyHidden-DFW7Efj5.js";import"./Tabs-D9LQ24jE.js";import"./useHasTabbableChild-BuaSMVBJ.js";import"./BUIRoutingProvider-BRX0aVpd.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
