import{j as o}from"./iframe-Ca4Oq2uP.js";import{c as e}from"./plugin-DmM0PbHN.js";import{S as l}from"./Grid-DvRbNd4W.js";import{C as m}from"./ComponentAccordion-uddfGs7O.js";import{w as a}from"./appWrappers-DhOSUPKL.js";import{T as i}from"./TemplateBackstageLogoIcon-B9kxlgCe.js";import{I as s}from"./InfoCard-CTsToJIt.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Gf4U2wcG.js";import"./componentData-CRvdRyiq.js";import"./useAnalytics-BO6qv_N6.js";import"./useApp-CIEu2n9t.js";import"./useRouteRef-BGRvnXy4.js";import"./index-CWD4-Z7Q.js";import"./DialogTitle-DcpjkfLf.js";import"./Modal-DNybagJK.js";import"./Portal-DfnbqdYt.js";import"./Backdrop-B0S7DZUH.js";import"./Button-lNm9l9il.js";import"./useObservable-D5OlgkuN.js";import"./useIsomorphicLayoutEffect-D_xlHkKu.js";import"./ExpandMore-BYyl-nAO.js";import"./AccordionDetails-C-jAEpJA.js";import"./index-B9sM2jn7.js";import"./Collapse-B_fsMJ0G.js";import"./useAsync-DQa5qi3g.js";import"./useMountedState-am8g5938.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BhfeUuXc.js";import"./ErrorBoundary-Do1MdOmP.js";import"./ErrorPanel-B9MZJL52.js";import"./WarningPanel-D_gQNl9J.js";import"./MarkdownContent-CCSCaS3C.js";import"./CodeSnippet-BNIZNbBb.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./CopyTextButton-CxyLRgr5.js";import"./useCopyToClipboard-CrLUyXrt.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./ListItem-BrncrmWC.js";import"./ListItemText-VT7wc13t.js";import"./LinkButton-C2Y4nle9.js";import"./Link-C9Yjpk8V.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-CP6xFFSM.js";import"./Divider-I0xPhLEa.js";import"./CardActions-EN8qOMz-.js";import"./BottomLink-CRrKsmqK.js";import"./ArrowForward-CTfGuzv6.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
