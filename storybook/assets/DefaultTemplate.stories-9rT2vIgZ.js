import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-DCoYcZLi.js";import{s as g,H as u}from"./plugin-BR36UYxA.js";import{c as h}from"./api-D2SeQQV1.js";import{c as f}from"./catalogApiMock-Iq8fO4jT.js";import{s as x}from"./api-CtEo9Teb.js";import{S as y}from"./SearchContext-COprA1mB.js";import{P as S}from"./Page-BbtOE5vg.js";import{S as r}from"./Grid-D58TNpxw.js";import{b as k,a as j,c as C}from"./plugin-Cy-L2iFb.js";import{T as P}from"./TemplateBackstageLogo-CjTYuzDn.js";import{T as I}from"./TemplateBackstageLogoIcon-Cx0DYmFY.js";import{e as T}from"./routes-rn4rHoeM.js";import{w as v}from"./appWrappers-bScNmkAy.js";import{s as G}from"./StarredEntitiesApi-CZpY29mi.js";import{M as A}from"./MockStarredEntitiesApi-3R3_VNhp.js";import{I as B}from"./InfoCard-jQMy2gNa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CXqAb5g3.js";import"./Plugin-CPv3ynDX.js";import"./componentData-OraWGl32.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./useRouteRef-D7QjhLBn.js";import"./index-CZ9gZJRb.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BaVFaK6n.js";import"./useMountedState-CnGoVtA3.js";import"./DialogTitle-CfF7TlGp.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./Backdrop-BzZC6sIJ.js";import"./Button-Cp5oCkaD.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BVxN23xK.js";import"./ErrorBoundary-CrlGkNeT.js";import"./ErrorPanel-D9pajOJW.js";import"./WarningPanel-2R8Y_I4d.js";import"./ExpandMore-BjerwzBY.js";import"./AccordionDetails-D0-Ip2Ry.js";import"./index-B9sM2jn7.js";import"./Collapse-K2usbj1G.js";import"./MarkdownContent-B24-9cF1.js";import"./CodeSnippet-BoQ2ohjZ.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./CopyTextButton-Crh7sKVk.js";import"./useCopyToClipboard-Ceo0QToL.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./ListItemText-BwT95NDX.js";import"./LinkButton-DC4rMSam.js";import"./Link-BB_0S9nF.js";import"./CardHeader-B32gDeY8.js";import"./Divider-Ca-0TjsJ.js";import"./CardActions-BhlKSozU.js";import"./BottomLink-DKSFJeM5.js";import"./ArrowForward-BR9xJcBP.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
