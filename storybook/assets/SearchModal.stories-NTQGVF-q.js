import{bR as t,u as d,l as u,a5 as h}from"./iframe-BNSLO1vV.js";import{r as g}from"./plugin-Ba8BrMGu.js";import{S as m,u as n,b as x}from"./useSearchModal-DOkIC91W.js";import{B as c}from"./Button-CxhMyqTz.js";import{c as S,b as f,a as M}from"./DialogTitle-BHi8qFfB.js";import{B as j}from"./Box-CUryh8iW.js";import{S as r}from"./Grid-C9Nu3WVI.js";import{S as C}from"./SearchType-D0yZw-dV.js";import{L as y}from"./List-BFUn9Abz.js";import{H as R}from"./DefaultResultListItem-DxdgFOXv.js";import{O as I}from"./appWrappers-D25q5zIL.js";import{m as B}from"./makeStyles-CZnQSWDh.js";import{s as D,M as b}from"./api-BZ8kNTH5.js";import{S as k}from"./SearchContext-bEe89pEF.js";import{SearchBar as v}from"./SearchBar-CtoW608B.js";import{S as T}from"./SearchResult-D60ya4DQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DIm3q6K3.js";import"./Plugin-CBXt3IyR.js";import"./componentData-Cg5QnkiE.js";import"./useAnalytics-CeiKLkx8.js";import"./useApp-CMrJz5U2.js";import"./useRouteRef-wgc6G7xr.js";import"./ArrowForward-BWDyI-Yp.js";import"./translation-BHm4_7zb.js";import"./Page-CCW8LZ61.js";import"./useMediaQuery-DM5QQtjA.js";import"./Divider-BZnZb-VC.js";import"./ArrowBackIos-BNmZgcK3.js";import"./ArrowForwardIos-CGbBOvBS.js";import"./translation-kIfognLO.js";import"./Modal-nGlf-rBn.js";import"./Portal-CJWU_qpN.js";import"./Backdrop-DfTyvlQL.js";import"./styled-X4ZADqyc.js";import"./ExpandMore-CPyaxJI3.js";import"./useAsync-CHPEVN6N.js";import"./useMountedState-C8SUUxYo.js";import"./AccordionDetails-BE2BfFWF.js";import"./index-B9sM2jn7.js";import"./Collapse-CdGjPTi6.js";import"./ListItem-D39zADcQ.js";import"./ListContext-gUlqcjcC.js";import"./ListItemIcon-K_JVgzTT.js";import"./ListItemText-CEe2QXcK.js";import"./Tabs-CQ6oI5BZ.js";import"./KeyboardArrowRight-ASkNxXmb.js";import"./FormLabel-ChhSk45S.js";import"./formControlState-BadJM4hK.js";import"./InputLabel-C5q1KX6G.js";import"./Select-D-6M43aA.js";import"./Popover-CqmPfk9S.js";import"./MenuItem-psWlGfqk.js";import"./Checkbox-C7R6B2gI.js";import"./SwitchBase-COB0WLi2.js";import"./Chip-BCwemPjy.js";import"./Link-K3MkQ3D3.js";import"./index-C8wTAkbr.js";import"./lodash-CaDdG74r.js";import"./WebStorage-CnW4n8fw.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Xx9BLHT2.js";import"./useIsomorphicLayoutEffect-DTD9neL-.js";import"./BUIProvider-C1aeAfVF.js";import"./openLink-D76OisA9.js";import"./useResolvedHref-Cc2IO8w5.js";import"./Search-US6Fx8TD.js";import"./useDebounce-BD6FDbxi.js";import"./InputAdornment-YeCzVuSb.js";import"./TextField-CmJ7hGbL.js";import"./useElementFilter-CCCJxJ0j.js";import"./EmptyState-Bj_DxYyu.js";import"./Progress-B8M9Mjwl.js";import"./LinearProgress-D9IrF5HX.js";import"./ResponseErrorPanel-CACrKcr0.js";import"./ErrorPanel-aHrobAaO.js";import"./WarningPanel-BNZzBLor.js";import"./MarkdownContent-wl8ON4O6.js";import"./CodeSnippet-CVrHcUGI.js";import"./CopyTextButton-CXVDPBul.js";import"./useCopyToClipboard-78lqQjz0.js";import"./Tooltip-BJEELWEm.js";import"./Popper-hi3NpXOV.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
