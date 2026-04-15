import{j as t,S as d,a0 as u,$ as h}from"./iframe-BZbCHoUM.js";import{r as g}from"./plugin-BvSmjq6i.js";import{S as m,u as n,a as x}from"./useSearchModal-CeD-C40e.js";import{B as c}from"./Button-DVx3XNhs.js";import{D as S,a as f,b as M}from"./DialogTitle-C1bnP3tL.js";import{B as j}from"./Box-DY6-eBkT.js";import{S as r}from"./Grid-MM8AuGcB.js";import{S as C}from"./SearchType-JD7wo4Jt.js";import{L as y}from"./List-CodZ-AVF.js";import{H as I}from"./DefaultResultListItem-DtbmPNl3.js";import{w as R}from"./appWrappers-DmQpvAa6.js";import{m as B}from"./makeStyles-CqvbDVNY.js";import{s as D,M as k}from"./api-DWerhnkt.js";import{S as v}from"./SearchContext-DJWl5ftV.js";import{SearchBar as T}from"./SearchBar-CjcIY4V0.js";import{S as b}from"./SearchResult-CtvnccZe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvKkHgEa.js";import"./Plugin-BBB_yavj.js";import"./componentData-BhhiEvWu.js";import"./useAnalytics-CRERthYg.js";import"./useApp-gzInJQTH.js";import"./useRouteRef-B8wdF5X4.js";import"./ArrowForward-EBA7ug1C.js";import"./translation-DPYA4iG_.js";import"./Page-BqqfkJCt.js";import"./useMediaQuery-vsoiSRSO.js";import"./Divider-BEwpmjmh.js";import"./ArrowBackIos-q0LfIuX3.js";import"./ArrowForwardIos-BvvD7o2R.js";import"./translation-DZBGSLoy.js";import"./Modal-DVelOBwr.js";import"./Portal-ByyC8-qY.js";import"./Backdrop-GWI2AAKc.js";import"./styled-DCK0eGG-.js";import"./ExpandMore-BK4RBO6u.js";import"./useAsync-CpsMysc8.js";import"./useMountedState-DDoOMb-K.js";import"./AccordionDetails-IcArkn8N.js";import"./index-B9sM2jn7.js";import"./Collapse-O7kbB5jx.js";import"./ListItem-CUvfBfLi.js";import"./ListContext-CbM2lO0s.js";import"./ListItemIcon-B3Fb-NWP.js";import"./ListItemText-B1g8sngL.js";import"./Tabs-CXJL4E0y.js";import"./KeyboardArrowRight-J1YKPKG3.js";import"./FormLabel-BEHcTVwK.js";import"./formControlState-DCzZZNxq.js";import"./InputLabel-BhOsjxyc.js";import"./Select-qSDauMKl.js";import"./Popover-BIOnDNcK.js";import"./MenuItem-CZ1UdhPX.js";import"./Checkbox-CMo1Qd_G.js";import"./SwitchBase-BUc52mi2.js";import"./Chip-CFLz2P4f.js";import"./Link-BTIv8AuK.js";import"./index-CkvjDYOq.js";import"./lodash-ztOqvY5v.js";import"./WebStorage-Da6sYLJe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DzWVQzjN.js";import"./useIsomorphicLayoutEffect-CgsGPlW-.js";import"./BUIProvider-C3FBe102.js";import"./openLink-DkamvTea.js";import"./Search-Mc9KQ7OJ.js";import"./useDebounce-DYom_IBa.js";import"./InputAdornment-CZLVmXz_.js";import"./TextField-xNVUloAz.js";import"./useElementFilter-BxPKxTNy.js";import"./EmptyState-BBS4JsT_.js";import"./Progress-CAVJtt6e.js";import"./LinearProgress-DZJ6sM2J.js";import"./ResponseErrorPanel-eVIN8LUX.js";import"./ErrorPanel-BO4erbiK.js";import"./WarningPanel-CMI-KGkp.js";import"./MarkdownContent-6KVzm0dh.js";import"./CodeSnippet-TtQaWekH.js";import"./CopyTextButton-C5lMDgwt.js";import"./useCopyToClipboard-BynW4vbA.js";import"./Tooltip-CdMmLUhb.js";import"./Popper-DDFF7RGu.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
