import{bR as t,u as d,l as u,a5 as h}from"./iframe-C0kJxuo3.js";import{r as g}from"./plugin-BlWJ1aAr.js";import{S as m,u as n,b as x}from"./useSearchModal-mOuN-tPe.js";import{B as c}from"./Button-BoKineoV.js";import{c as S,b as f,a as M}from"./DialogTitle-DtBqQXFj.js";import{B as j}from"./Box-CnWgbgkY.js";import{S as r}from"./Grid-C-s0xDvK.js";import{S as C}from"./SearchType-Dc3rlkQ7.js";import{L as y}from"./List-CPgTpnJc.js";import{H as R}from"./DefaultResultListItem-isVRqZih.js";import{O as I}from"./appWrappers-DqfuR-C8.js";import{m as B}from"./makeStyles-D5-PJbNp.js";import{s as D,M as b}from"./api-CGnsyOtx.js";import{S as k}from"./SearchContext-CN5V66AW.js";import{SearchBar as v}from"./SearchBar-rwIkOucz.js";import{S as T}from"./SearchResult-D3YZ0D1d.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C8Ow8SSa.js";import"./Plugin-B3Qpr9A4.js";import"./componentData-aev9F6Z-.js";import"./useAnalytics-X-Bs5xc4.js";import"./useApp-CXLNLZbd.js";import"./useRouteRef-avp4y8TI.js";import"./ArrowForward-d-y3Jryx.js";import"./translation-d9pVoYES.js";import"./Page-s5caOXo6.js";import"./useMediaQuery-CG0UCByO.js";import"./Divider-DGNf_kMs.js";import"./ArrowBackIos-DoKoPA8n.js";import"./ArrowForwardIos-BuhZqtJY.js";import"./translation-cknnQOai.js";import"./Modal-jYxltuJv.js";import"./Portal-Bt9mGg9Y.js";import"./Backdrop-DHSK9K4t.js";import"./styled-D_oPDrlm.js";import"./ExpandMore-DVl-eaS_.js";import"./useAsync-DtKVmQXw.js";import"./useMountedState-CiDqhiaq.js";import"./AccordionDetails-AvcLZndj.js";import"./index-B9sM2jn7.js";import"./Collapse-BC7i5t7Q.js";import"./ListItem-Ck6Lxrwn.js";import"./ListContext-DicoL8cb.js";import"./ListItemIcon-BFC_bug8.js";import"./ListItemText-lwnBct1y.js";import"./Tabs-CqyUVx26.js";import"./KeyboardArrowRight-Cfj2n8D0.js";import"./FormLabel-CmiGlpSs.js";import"./formControlState-C_tuwfvD.js";import"./InputLabel-BCkJtELJ.js";import"./Select-C8jQzgiJ.js";import"./Popover-DEvxK_jS.js";import"./MenuItem-oNIJE4Xp.js";import"./Checkbox-j6qYhB-I.js";import"./SwitchBase-CH5HQub3.js";import"./Chip-CVgTdFO2.js";import"./Link-B6P5VGLF.js";import"./index-BwD_LcUE.js";import"./lodash-BJ7VBBcx.js";import"./WebStorage-CXEzm-39.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-WinG3YAH.js";import"./useIsomorphicLayoutEffect-Dmwd1vyk.js";import"./BUIProvider-CwKEQyi-.js";import"./openLink-DDhi7ntb.js";import"./useResolvedHref-Cysl8ASX.js";import"./Search-C4Q78pN4.js";import"./useDebounce-Ceb6hX6S.js";import"./InputAdornment-CcldPSN9.js";import"./TextField-C5a191Gx.js";import"./useElementFilter-Bvf5jRO8.js";import"./EmptyState-bjs6_K9e.js";import"./Progress-BSDKHxRy.js";import"./LinearProgress-F7qec841.js";import"./ResponseErrorPanel-T1-piE7H.js";import"./ErrorPanel-CP2vAim2.js";import"./WarningPanel-CzSWBL6o.js";import"./MarkdownContent-COY5Cdsn.js";import"./CodeSnippet-BBirL-_v.js";import"./CopyTextButton-C8XScxm7.js";import"./useCopyToClipboard-yaKkIs1M.js";import"./Tooltip-aKqJkO8O.js";import"./Popper-Cp0AdtCe.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
