import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DqJQ9uPs.js";import{r as x}from"./plugin-GjKQLFY4.js";import{S as m,u as n,a as S}from"./useSearchModal-BYXAFjel.js";import{B as c}from"./Button-D9LFAX2g.js";import{a as f,b as M,c as j}from"./DialogTitle-DiqXRAVM.js";import{B as C}from"./Box-7v7Ku6kY.js";import{S as r}from"./Grid-KKLALRV6.js";import{S as y}from"./SearchType-C0Qifozz.js";import{L as I}from"./List-HqDhN-yv.js";import{H as R}from"./DefaultResultListItem-D7upjkEl.js";import{s as B,M as D}from"./api-DFeRnRBI.js";import{S as T}from"./SearchContext-CDPFSwZ_.js";import{w as k}from"./appWrappers-DvUcS6kA.js";import{SearchBar as v}from"./SearchBar-BjrQpfLG.js";import{a as b}from"./SearchResult-CLUSkvFa.js";import"./preload-helper-D9Z9MdNV.js";import"./index-IonfJZQ1.js";import"./Plugin-DUvFkCSb.js";import"./componentData-9JsUC9W5.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./useRouteRef-DZAPdgx2.js";import"./index-DalzLXVm.js";import"./ArrowForward-DPFWrTp5.js";import"./translation-EyQMhH41.js";import"./Page-D2jEA7IO.js";import"./useMediaQuery-DN21eh0U.js";import"./Divider-xOTMBAcj.js";import"./ArrowBackIos-CD41ds3X.js";import"./ArrowForwardIos-B4Ts4ftA.js";import"./translation-Zm4WQ7LK.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./Backdrop-lmkQ576F.js";import"./styled-DV7YmZBO.js";import"./ExpandMore-BotAWQ1n.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./AccordionDetails-Dyf75Eaf.js";import"./index-DnL3XN75.js";import"./Collapse-BECsH0M_.js";import"./ListItem-DIBtNilh.js";import"./ListContext-DWNGGGl9.js";import"./ListItemIcon-DddJgjrL.js";import"./ListItemText-QaJAw11k.js";import"./Tabs-DqZ__Is-.js";import"./KeyboardArrowRight-C1HzRoK8.js";import"./FormLabel-CFDsgmCA.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CUP8RVYe.js";import"./InputLabel-DI2qx3ui.js";import"./Select-BTs0VRvv.js";import"./Popover-O0XQDvdf.js";import"./MenuItem-CVc4UX_G.js";import"./Checkbox-CMX1Hq5y.js";import"./SwitchBase-dvRTwFBi.js";import"./Chip-BMnNLW81.js";import"./Link-ClrQx1QP.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BFFjDBdX.js";import"./useDebounce-CUiC67Nq.js";import"./InputAdornment-COc8rih1.js";import"./TextField-DaWEjdom.js";import"./useElementFilter-CJngIIsu.js";import"./EmptyState-BKayicot.js";import"./Progress-Cytqjl3n.js";import"./LinearProgress-C_iy2IoU.js";import"./ResponseErrorPanel-Cd2ZjE5Q.js";import"./ErrorPanel-BTFsykmd.js";import"./WarningPanel-DWxbAFrU.js";import"./MarkdownContent-DTBwyM42.js";import"./CodeSnippet-BQDzaUOg.js";import"./CopyTextButton-Y9iCOjyT.js";import"./useCopyToClipboard-DMYhOdjt.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
