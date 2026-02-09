import{j as o}from"./iframe-CXYsSFqX.js";import{c as e}from"./plugin-D4U0AyrD.js";import{S as l}from"./Grid-CBLufU_i.js";import{C as m}from"./ComponentAccordion-BHlTNs6d.js";import{w as a}from"./appWrappers-DM9hoX1F.js";import{T as i}from"./TemplateBackstageLogoIcon-DCyV3F6Q.js";import{I as s}from"./InfoCard-BhEjsNW2.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYVtm61E.js";import"./componentData-B-Xp-WjF.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./useRouteRef-D_K4aVES.js";import"./index-mbELQmCK.js";import"./DialogTitle-CexE-OMt.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./Backdrop-DpZkZfXy.js";import"./Button-D0m-IwQo.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./index-B9sM2jn7.js";import"./Collapse-BITvwjhQ.js";import"./useAsync-CNZKjAjJ.js";import"./useMountedState-2cXymIoR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BfiKMwCo.js";import"./ErrorBoundary-BYKn89zI.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./CopyTextButton-DFxCHX8I.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./ListItem-DLX99J84.js";import"./ListItemText-CvzrIeis.js";import"./LinkButton-DyFnZC8S.js";import"./Link-DWEj90Ez.js";import"./lodash-Czox7iJy.js";import"./CardHeader-kRzKqXby.js";import"./Divider-DuenxdSn.js";import"./CardActions-DornRNWZ.js";import"./BottomLink-D1PtYDTo.js";import"./ArrowForward-Ak_-qeRR.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
