import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DDGN0cGv.js";import{r as x}from"./plugin-DcGVZ5m9.js";import{S as m,u as n,a as S}from"./useSearchModal-GQ3cc5v3.js";import{B as c}from"./Button-BfPTYQOm.js";import{a as f,b as M,c as j}from"./DialogTitle-CZfoj8Tu.js";import{B as C}from"./Box-Ddxf02Aa.js";import{S as r}from"./Grid-D5cwdvdp.js";import{S as y}from"./SearchType-BPkQkDzv.js";import{L as I}from"./List-B6XxVgNa.js";import{H as R}from"./DefaultResultListItem-BENqHHis.js";import{s as B,M as D}from"./api-QlE9xgJi.js";import{S as T}from"./SearchContext-CENdRfZX.js";import{w as k}from"./appWrappers-C8vp-7ey.js";import{SearchBar as v}from"./SearchBar-Cje4Qo8j.js";import{a as b}from"./SearchResult-B5CcshjU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C9NKfyH6.js";import"./Plugin-CBvsz8vm.js";import"./componentData-lXmOowuG.js";import"./useAnalytics-CyvQxdhU.js";import"./useApp-CWuHwuj4.js";import"./useRouteRef-6TTRl5Mq.js";import"./index-DCDfH_Li.js";import"./ArrowForward-KHx9CCNT.js";import"./translation-BUa1tb2S.js";import"./Page-CHZLbfvY.js";import"./useMediaQuery-B_lKUfT2.js";import"./Divider-nJoj97pl.js";import"./ArrowBackIos-CosXFsQm.js";import"./ArrowForwardIos-Drf-ZT2Y.js";import"./translation-1F1HxzSJ.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./Backdrop-0jy0HFas.js";import"./styled-BpU391Me.js";import"./ExpandMore-DdbG_Iny.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./AccordionDetails-D8hpySZx.js";import"./index-B9sM2jn7.js";import"./Collapse-1BtLbcFp.js";import"./ListItem-B4p-bJZY.js";import"./ListContext-BfPeZX-c.js";import"./ListItemIcon-DzLg1Qai.js";import"./ListItemText-D6aBcig9.js";import"./Tabs-6UGAgJ6N.js";import"./KeyboardArrowRight-CtJLJr1F.js";import"./FormLabel-Cvs8umqz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BrQ4BsJz.js";import"./InputLabel-xEVhEFxf.js";import"./Select-C5MBmxAB.js";import"./Popover-BIEPvO5s.js";import"./MenuItem-DotvnHD1.js";import"./Checkbox-B2s7QLiP.js";import"./SwitchBase-BKApDkHi.js";import"./Chip-CrmC8B9P.js";import"./Link-UwAe9NOh.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BQT9sMDK.js";import"./useDebounce-CcQOPBpL.js";import"./InputAdornment-B36Zm4QQ.js";import"./TextField-CfRq2jh9.js";import"./useElementFilter-CNq4VEjT.js";import"./EmptyState-D9Y-fUSS.js";import"./Progress-2vcWT6H-.js";import"./LinearProgress-BqbJleYC.js";import"./ResponseErrorPanel-BBX_cO07.js";import"./ErrorPanel-sm5fOIxM.js";import"./WarningPanel-BvxUrI8I.js";import"./MarkdownContent-D_mSSllG.js";import"./CodeSnippet-DUu5zKgy.js";import"./CopyTextButton-K6z11-1u.js";import"./useCopyToClipboard-BVpL61aI.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
